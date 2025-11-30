import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute(`
      SELECT 
        nim,
        nama_lengkap,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        email,
        no_telephone,
        prodi,
        pendidikan_terakhir,
        linkedin,
        keahlian,
        foto,
        tentang_anda,
        cv
      FROM pencari_kerja
      ORDER BY nim DESC
    `);

    await db.end();

    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
