import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req, context) {
  try {
    const { id } = await context.params;  // params harus di await

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // === Ambil detail lowongan sesuai ID ===
    const [loker] = await db.query(
      `SELECT l.*, a.nama_perusahaan
       FROM lowongan_kerja l
       LEFT JOIN admin_perusahaan a ON l.id_admin = a.id_admin
       WHERE l.id_lowongan = ?`,
      [id]
    );

    // === Ambil daftar pelamar ===
    const [pelamar] = await db.query(
      `SELECT pk.*, m.status_pendaftaran
       FROM pencari_kerja pk
       JOIN mendaftar m ON m.nim = pk.nim
       WHERE m.id_lowongan = ?`,
      [id]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      lowongan: loker[0] || null,
      pelamar,
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
