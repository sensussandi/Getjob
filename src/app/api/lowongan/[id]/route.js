import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req, { params }) {
  const { id } = params;
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.query(
      `SELECT l.*, a.nama_perusahaan 
       FROM lowongan_kerja AS l 
       JOIN admin_perusahaan AS a ON l.id_admin = a.id_admin
       WHERE l.id_lowongan = ?`,
      [id]
    );

    await db.end();

    if (rows.length === 0)
      return NextResponse.json({ success: false, message: "Lowongan tidak ditemukan" }, { status: 404 });

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("❌ Error detail lowongan:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
