import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");

    if (!nim) {
      return NextResponse.json({ success: false, message: "NIM tidak diberikan" });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // JOIN ke tabel lowongan
    const [rows] = await db.execute(
      `
      SELECT 
        p.status_pendaftaran,
        p.tanggal_daftar,
        l.nama_posisi
      FROM pendaftaran p
      JOIN lowongan l ON l.id_lowongan = p.id_lowongan
      WHERE p.nim = ?
      ORDER BY p.id_pendaftaran DESC
      `,
      [nim]
    );

    await db.end();

    const notif = rows.map((row, i) => ({
      id: i + 1,
      pesan:
        row.status_pendaftaran === "diterima"
          ? `Lamaran Anda untuk posisi ${row.nama_posisi} DITERIMA`
          : row.status_pendaftaran === "tidak"
          ? `Lamaran Anda untuk posisi ${row.nama_posisi} DITOLAK`
          : `Lamaran Anda pada posisi ${row.nama_posisi} MENUNGGU`,
      waktu: row.tanggal_daftar,
      unread: true,
    }));

    return NextResponse.json({ success: true, data: notif });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Gagal mengambil notifikasi" });
  }
}
