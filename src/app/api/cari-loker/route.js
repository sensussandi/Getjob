import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// === KONFIGURASI DATABASE ===
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "getjob_db", // sesuai dengan database kamu
};

// === GET: Ambil & cari data dari tabel lowongan_kerja ===
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || "";
    const lokasi = searchParams.get("lokasi") || "";
    const kategori = searchParams.get("kategori") || "";

    const db = await mysql.createConnection(dbConfig);

    // Query pencarian berdasarkan keyword, lokasi, dan kategori (kualifikasi)
    const [rows] = await db.execute(
      `
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
      FROM lowongan_kerja l
      JOIN admin_perusahaan a ON l.id_admin = a.id_admin
      WHERE (l.nama_posisi LIKE ? OR l.deskripsi_pekerjaan LIKE ? OR a.nama_perusahaan LIKE ?)
        AND (l.lokasi LIKE ?)
        AND (l.kualifikasi LIKE ?)
      ORDER BY l.tanggal_dibuka DESC
      `,
      [
        `%${keyword}%`,
        `%${keyword}%`,
        `%${keyword}%`,
        `%${lokasi}%`,
        `%${kategori}%`,
      ]
    );

    await db.end();

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error ambil data lowongan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat data lowongan", error: error.message },
      { status: 500 }
    );
  }
}
