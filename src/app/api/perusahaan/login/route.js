import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
// import bcrypt from "bcryptjs"; // kalau password kamu nanti mau di-hash

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 🧩 Koneksi ke database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // 🧠 Cek apakah email ada di tabel admin_perusahaan
    const [rows] = await db.query(
      `SELECT * FROM admin_perusahaan WHERE email_perusahaan = ?`,
      [email]
    );

    // Kalau tidak ditemukan
    if (rows.length === 0) {
      await db.end();
      return NextResponse.json(
        { success: false, message: "Email tidak ditemukan." },
        { status: 401 }
      );
    }

    const user = rows[0];

    // 🔐 Bandingkan password (plain text dulu, nanti bisa diganti bcrypt)
    // if (password !== user.password) {
    //   await db.end();
    //   return NextResponse.json(
    //     { success: false, message: "Password salah." },
    //     { status: 401 }
    //   );
    // }

    // ✅ Kalau email & password benar
    await db.end();
    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      perusahaan: {
        id_admin: user.id_admin,
        nama_admin: user.nama_admin,
        nama_perusahaan: user.nama_perusahaan,
        email: user.email_perusahaan,
        alamat: user.alamat_perusahaan,
        no_telepone: user.no_telepone,
      },
    });
  } catch (err) {
    console.error("Error saat login:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
