import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      nama_perusahaan,
      email_perusahaan,
      alamat_perusahaan,
      tentang_perusahaan,
      logo_url,
      password,
      no_telepone, // <- sesuai kolom database kamu
    } = body;

    // Validasi input wajib
    if (!nama_perusahaan || !email_perusahaan || !password) {
      return NextResponse.json(
        { success: false, message: "Nama perusahaan, email, dan password wajib diisi!" },
        { status: 400 }
      );
    }

    // Koneksi ke database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // Pastikan nilai undefined diganti null agar tidak error di SQL
    const safeAlamat = alamat_perusahaan ?? null;
    const safeTentang = tentang_perusahaan ?? null;
    const safeLogo = logo_url ?? null;
    const safeTelp = no_telepone ?? null;

    // Insert ke tabel admin_perusahaan
    await db.execute(
      `INSERT INTO admin_perusahaan 
        (nama_perusahaan, email_perusahaan, alamat_perusahaan, tentang_perusahaan, logo_url, password, no_telepone, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nama_perusahaan,
        email_perusahaan,
        safeAlamat,
        safeTentang,
        safeLogo,
        hashedPassword,
        safeTelp,
        'admin',
      ]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      message: "✅ Data perusahaan berhasil ditambahkan!",
    });
  } catch (error) {
    console.error("❌ Error register:", error.message);
    if (error.sqlMessage) console.error("🧠 SQL Error:", error.sqlMessage);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
        error: error.sqlMessage || error.message,
      },
      { status: 500 }
    );
  }
}
