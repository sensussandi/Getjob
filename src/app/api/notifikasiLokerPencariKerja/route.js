import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");

    if (!nim) {
      return NextResponse.json({
        success: false,
        message: "NIM tidak diberikan",
      });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // 🔥 Ambil status lamaran + nama lowongan + status read
    const [rows] = await db.execute(
      `
      SELECT 
        m.id_pendaftaran,
        m.status_pendaftaran,
        m.tanggal_daftar,
        m.is_read,
        l.nama_posisi
      FROM mendaftar m
      JOIN lowongan_kerja l ON l.id_lowongan = m.id_lowongan
      WHERE m.nim = ?
      ORDER BY m.id_pendaftaran DESC
      `,
      [nim]
    );

    await db.end();

    const notif = rows.map((row) => ({
      id: row.id_pendaftaran, // ID penting untuk update read
      pesan:
        row.status_pendaftaran === "diterima"
          ? `Lamaran Anda untuk posisi ${row.nama_posisi} DITERIMA`
          : row.status_pendaftaran === "tidak"
          ? `Lamaran Anda untuk posisi ${row.nama_posisi} DITOLAK`
          : `Lamaran Anda pada posisi ${row.nama_posisi} MENUNGGU`,
      waktu: row.tanggal_daftar,
      unread: row.is_read === 0, // TRUE jika belum dibaca
      id_pendaftaran: row.id_pendaftaran,
    }));

    return NextResponse.json({
      success: true,
      data: notif,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil notifikasi",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
