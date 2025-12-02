import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi!" },
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

    // 🔹 Cek dulu di tabel admin_perusahaan
    const [adminRows] = await db.execute(
      "SELECT * FROM admin_perusahaan WHERE email_perusahaan = ?",
      [email]
    );

    // 🔹 Jika tidak ditemukan di admin_perusahaan, cek di users
    let user = null;
    let tableType = "";

    if (adminRows.length > 0) {
      user = adminRows[0];
      tableType = "admin_perusahaan";
    } else {
      const [userRows] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (userRows.length > 0) {
        user = userRows[0];
        tableType = "users";
      }
    }

    await db.end();

    // 🔹 Kalau tidak ditemukan di kedua tabel
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email tidak ditemukan di sistem!" },
        { status: 404 }
      );
    }

 


    // 🔹 Tentukan redirect sesuai role
    let redirect = "/";
    let role = user.role;


    // ✅ Login berhasil
    return NextResponse.json({
      success: true,
      message: "Login berhasil!",
      redirect,
    
      data
    });
  } catch (error) {
    console.error("❌ Error saat login:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server!" },
      { status: 500 }
    );
  }
}
