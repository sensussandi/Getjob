import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

// GET — Ambil semua data user berdasarkan NIM
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

    // Kembalikan data user ke frontend
    return NextResponse.json({ success: true, user: rows[0] });
    } catch (error) {
    console.error("GET /api/editProfileMHS error:", error);
    return NextResponse.json({
        success: false,
        message: "Gagal memuat data user.",
        error: error.message,
    });
    }
}

// POST — Simpan atau update semua data user
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

    // Siapkan folder upload
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

    // Koneksi ke database
    const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "getjob_db",
    });

    // HASH PASSWORD 
    let passwordBaru = password;
    const [userRows] = await db.execute("SELECT password FROM pencari_kerja WHERE nim = ?", [nim]);
    const passwordLama = userRows.length > 0 ? userRows[0].password : null;

    if (passwordBaru && passwordBaru.trim() !== "" && !(await bcrypt.compare(passwordBaru, passwordLama))) {
        const salt = await bcrypt.genSalt(10);
        passwordBaru = await bcrypt.hash(passwordBaru, salt);
    } else {
        passwordBaru = passwordLama;
    }

    // Cek apakah user sudah ada
    const [rows] = await db.execute("SELECT nim FROM pencari_kerja WHERE nim = ?", [nim]);

    if (rows.length === 0) {
      // INSERT user baru
        await db.execute(
        `INSERT INTO pencari_kerja 
        (nim, nama_lengkap, password, tanggal_lahir, jenis_kelamin, alamat, email, no_telephone, prodi, pendidikan_terakhir, linkedin, keahlian, tentang_anda, foto, cv)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            nim,
            nama_lengkap,
            passwordBaru,
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
        ]
        );
    } else {
      // UPDATE user lama
        await db.execute(
        `UPDATE pencari_kerja 
        SET nama_lengkap=?, password=?, tanggal_lahir=?, jenis_kelamin=?, alamat=?, 
                email=?, no_telephone=?, prodi=?, pendidikan_terakhir=?, linkedin=?, 
                keahlian=?, tentang_anda=?, 
                foto = COALESCE(?, foto), cv = COALESCE(?, cv)
            WHERE nim=?`,
        [
            nama_lengkap,
            passwordBaru,
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
        { success: false, message: "Gagal menyimpan data!", error: error.message },
        { status: 500 }
    );
    }
}