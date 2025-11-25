import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

// =================== [ GET DATA USER ] ===================
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");

    if (!nim)
      return NextResponse.json({
        success: false,
        message: "NIM tidak dikirim!",
      });

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute("SELECT * FROM pencari_kerja WHERE nim = ?", [nim]);
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "User tidak ditemukan!",
      });
    }

    // Hapus password agar tidak dikirim ke client
    delete rows[0].password;

    // Pastikan path foto bisa diakses dari frontend
    rows[0].foto = rows[0].foto
      ? `/uploads/${rows[0].foto}`
      : "/default-avatar.png";

    // Path CV juga dibuat jelas (jika ada)
    rows[0].cv = rows[0].cv ? `/uploads/${rows[0].cv}` : null;

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error("GET /api/editProfileMHS error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data user.", error: error.message },
      { status: 500 }
    );
  }
}

// =================== [ UPDATE / INSERT USER DATA ] ===================
export async function POST(req) {
  try {
    const formData = await req.formData();

    // Ambil semua data dari form
    const nim = formData.get("nim");
    const nama_lengkap = formData.get("nama_lengkap");
    const password = formData.get("password");
    const tanggal_lahir = formData.get("tanggal_lahir");
    const jenis_kelamin = formData.get("jenis_kelamin");
    const alamat = formData.get("alamat");
    const email = formData.get("email");
    const no_telephone = formData.get("no_telephone");
    const prodi = formData.get("prodi");
    const pendidikan_terakhir = formData.get("pendidikan_terakhir");
    const linkedin = formData.get("linkedin");
    const keahlian = formData.get("keahlian");
    const tentang_anda = formData.get("tentang_anda");
    const foto = formData.get("foto");
    const cv = formData.get("cv");

    if (!nim)
      return NextResponse.json({
        success: false,
        message: "NIM user tidak ditemukan!",
      });

    // === Folder upload ===
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file, name) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(path.join(uploadDir, name), buffer);
    };

    let fotoFileName = null;
    let cvFileName = null;

    if (foto && typeof foto.name === "string") {
      fotoFileName = `${Date.now()}_${foto.name}`;
      await saveFile(foto, fotoFileName);
    }
    if (cv && typeof cv.name === "string") {
      cvFileName = `${Date.now()}_${cv.name}`;
      await saveFile(cv, cvFileName);
    }

    // === Koneksi ke DB ===
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Ambil password lama
    const [userRows] = await db.execute("SELECT password FROM pencari_kerja WHERE nim = ?", [nim]);
    const passwordLama = userRows.length > 0 ? userRows[0].password : null;

    // === Logika password aman ===
    let passwordFinal = passwordLama;
    if (password && password.trim() !== "") {
      // Jika password baru diisi → hash baru
      passwordFinal = await bcrypt.hash(password, 10);
    }

    // === Cek apakah user sudah ada ===
    const [rows] = await db.execute("SELECT nim FROM pencari_kerja WHERE nim = ?", [nim]);

    if (rows.length === 0) {
      // === INSERT ===
      await db.execute(
        `INSERT INTO pencari_kerja 
        (nim, nama_lengkap, password, tanggal_lahir, jenis_kelamin, alamat, email, no_telephone, prodi, pendidikan_terakhir, linkedin, keahlian, tentang_anda, foto, cv, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nim,
          nama_lengkap,
          passwordFinal,
          tanggal_lahir || null,
          jenis_kelamin || null,
          alamat || "",
          email || "",
          no_telephone || "",
          prodi || "",
          pendidikan_terakhir || "",
          linkedin || "",
          keahlian || "",
          tentang_anda || "",
          fotoFileName || null,
          cvFileName || null,
          role || "",
        ]
      );
    } else {
      // === UPDATE ===
      await db.execute(
        `UPDATE pencari_kerja 
         SET nama_lengkap=?, password=?, tanggal_lahir=?, jenis_kelamin=?, alamat=?, 
             email=?, no_telephone=?, prodi=?, pendidikan_terakhir=?, linkedin=?, 
             keahlian=?, tentang_anda=?, 
             foto = COALESCE(?, foto), cv = COALESCE(?, cv)
         WHERE nim=?`,
        [
          nama_lengkap,
          passwordFinal,
          tanggal_lahir || null,
          jenis_kelamin || null,
          alamat || "",
          email || "",
          no_telephone || "",
          prodi || "",
          pendidikan_terakhir || "",
          linkedin || "",
          keahlian || "",
          tentang_anda || "",
          fotoFileName,
          cvFileName,
          nim,
        ]
      );
    }

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Data profil berhasil disimpan!",
    });
  } catch (error) {
    console.error("POST /api/editProfileMHS error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan data!",
        error: error.message,
      },
      { status: 500 }
    );
  }
}