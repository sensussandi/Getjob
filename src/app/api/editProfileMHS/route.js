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
      return NextResponse.json({ success: false, message: "NIM tidak dikirim!" });

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute("SELECT * FROM pencari_kerja WHERE nim = ?", [nim]);
    await db.end();

    if (rows.length === 0)
      return NextResponse.json({ success: false, message: "User tidak ditemukan!" });

    const user = rows[0];
    delete user.password;

    user.foto = user.foto ? `/uploads/${user.foto}` : "/default-avatar.jpg";
    user.cv = user.cv ? `/uploads/${user.cv}` : null;

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("GET /api/editProfileMHS error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data user", error: error.message },
      { status: 500 }
    );
  }
}

// =================== [ UPDATE DATA USER ] ===================
export async function POST(req) {
  try {
    const formData = await req.formData();

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
      return NextResponse.json({ success: false, message: "NIM tidak ditemukan!" });

    // Upload folder
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file, filename) => {
      const bytes = await file.arrayBuffer();
      fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(bytes));
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

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [oldPass] = await db.execute(
      "SELECT password FROM pencari_kerja WHERE nim = ?",
      [nim]
    );

    let passwordFinal = oldPass[0]?.password;
    if (password && password.trim() !== "") {
      passwordFinal = await bcrypt.hash(password, 10);
    }

    await db.execute(
      `UPDATE pencari_kerja SET 
        nama_lengkap=?, password=?, tanggal_lahir=?, jenis_kelamin=?, alamat=?, 
        email=?, no_telephone=?, prodi=?, pendidikan_terakhir=?, linkedin=?, 
        keahlian=?, tentang_anda=?, 
        foto = COALESCE(?, foto), 
        cv = COALESCE(?, cv)
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

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui!",
      fotoBaru: fotoFileName ? `/uploads/${fotoFileName}` : null,
      cvBaru: cvFileName ? `/uploads/${cvFileName}` : null
    });

  } catch (error) {
    console.error("POST /api/editProfileMHS error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal update", error: error.message },
      { status: 500 }
    );
  }
}