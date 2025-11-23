import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
const {
  nim,
  password,
  nama_lengkap,
  tanggal_lahir,
  jenis_kelamin,
  alamat,
  email,
  no_telephone,
  prodi,
  pendidikan_terakhir,
  linkedin,
} = body;

    if (!nim || !password || !nama_lengkap) {
      return NextResponse.json(
        { success: false, message: "NIM, Password, dan Nama wajib diisi!" },
        { status: 400 }
      );
    }

    // Pastikan NIM hanya berisi angka
    if (!/^\d+$/.test(nim)) {
      return NextResponse.json(
        { success: false, message: "NIM hanya boleh berisi angka!" },
        { status: 400 }
      );
    }

    // Konversi ke integer
    const nimNumber = Number(nim);

    // Batasi panjang agar aman di int(11)
    if (nimNumber > 2147483647) {
      return NextResponse.json(
        { success: false, message: "NIM terlalu besar untuk tipe INT(11)!" },
        { status: 400 }
      );
    }

    // 🔹 Koneksi ke database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // 🔹 Cek duplikat
    const [cek] = await db.execute(
      "SELECT nim FROM pencari_kerja WHERE nim = ?",
      [nimNumber]
    );
    if (cek.length > 0) {
      await db.end();
      return NextResponse.json(
        { success: false, message: "NIM sudah terdaftar!" },
        { status: 409 }
      );
    }

    // 🔹 Enkripsi password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    const savelinkedin = linkedin ?? null;

    // 🔹 Insert data baru
    await db.execute(
      `INSERT INTO pencari_kerja 
  (nim, password, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, 
   email, no_telephone, prodi, pendidikan_terakhir, linkedin, keahlian, foto, tentang_anda, cv)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    nimNumber,
    hashedPassword,
    nama_lengkap,
    tanggal_lahir,
    jenis_kelamin,
    alamat,
    email,
    no_telephone,
    prodi,
    pendidikan_terakhir,
    savelinkedin,
    null, // keahlian
    null, // foto
    null, // tentang_anda
    null, // cv
  ]
);
    await db.end();

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil!",
    });
  } catch (error) {
    console.error("❌ Error register:", error.message);
    if (error.sqlMessage) console.error("🧠 SQL Error:", error.sqlMessage);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server", error: error.sqlMessage || error.message },
      { status: 500 }
    );
  }
}
