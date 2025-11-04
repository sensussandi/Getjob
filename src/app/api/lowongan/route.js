import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // isi jika pakai password
      database: "getjob_db",
    });

    const [rows] = await db.query(`
      SELECT 
        l.id_lowongan,
        l.nama_posisi,
        l.deskripsi_pekerjaan,
        l.kualifikasi,
        l.gaji,
        l.lokasi,
        l.tanggal_dibuka,
        l.tanggal_ditutup,
        a.nama_perusahaan
      FROM lowongan_kerja AS l
      JOIN admin_perusahaan AS a ON l.id_admin = a.id_admin
      ORDER BY l.tanggal_dibuka DESC
    `);

    db.end();
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("❌ Error GET lowongan:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
