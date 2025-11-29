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
        l.*,
        a.nama_perusahaan
      FROM lowongan_kerja l
      LEFT JOIN admin_perusahaan a ON l.id_admin = a.id_admin
      ORDER BY l.id_lowongan DESC
    `);

    await db.end();

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Gagal mengambil data lowongan kerja",
      error: error.message,
    });
  }
}
