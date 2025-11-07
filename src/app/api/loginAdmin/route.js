import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // pastikan sudah install: npm install bcryptjs

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email dan password wajib diisi!" }, { status: 400 });
    }

    // koneksi database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // ambil data user
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Email tidak ditemukan!" }, { status: 404 });
    }

    const user = rows[0];

    // cek role admin atau super_admin
    if (user.role !== "admin" && user.role !== "super_admin") {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Anda bukan admin." },
        { status: 403 }
      );
    }

    // verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ success: false, message: "Password salah!" }, { status: 401 });
    }

    // jika valid
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      ref_id: user.ref_id,
      ref_perusahaan: user.ref_perusahaan,
    };

    return NextResponse.json({
      success: true,
      message: "Login berhasil!",
      data: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan server." }, { status: 500 });
  }
}
