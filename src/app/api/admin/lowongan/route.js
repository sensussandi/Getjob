import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    // ✅ 1. Koneksi database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // ✅ 2. Ambil data lowongan kerja
    const [rows] = await db.query(`
      SELECT * FROM lowongan_kerja ORDER BY id_lowongan DESC
    `);

    // ✅ 4. Tutup koneksi database
    await db.end();

    // ✅ 5. Kirim semua hasil ke frontend
    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (err) {
    console.error("❌ ERROR DASHBOARD:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dashboard",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
