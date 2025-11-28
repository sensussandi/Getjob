import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const { searchParams } = new URL(req.url);
    const id_lowongan = searchParams.get("id_lowongan");

    const [loker] = await db.query(`
      SELECT 
        l.*,
        a.nama_perusahaan
      FROM lowongan_kerja l
      LEFT JOIN admin_perusahaan a ON l.id_admin = a.id_admin
      ORDER BY l.id_lowongan DESC`,
      [id_lowongan]
    );

    const [pelamar] = await db.query(
      `SELECT pk.*
       FROM mendaftar m
       JOIN pencari_kerja pk ON pk.nim = m.nim
       WHERE m.id_lowongan = ?`,
      [id_lowongan]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      lowongan: loker[0],
      pelamar,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
