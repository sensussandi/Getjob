import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const keyword = searchParams.get("keyword") || "";
    const lokasi = searchParams.get("lokasi") || "";
    const kategori = searchParams.get("kategori") || ""; // kategori dipakai sebagai tipe_pekerjaan

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    let query = `
      SELECT 
        lk.*, 
        ap.nama_perusahaan,
        ap.logo_url
      FROM lowongan_kerja lk
      JOIN admin_perusahaan ap ON lk.id_admin = ap.id_admin
      WHERE 1 = 1
    `;

    let params = [];

    // Filter Keyword -> cari di nama_posisi, deskripsi, kualifikasi
    if (keyword) {
      query += ` 
        AND (
          lk.nama_posisi LIKE ?
          OR lk.deskripsi_pekerjaan LIKE ?
          OR lk.kualifikasi LIKE ?
        )
      `;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    // Filter Lokasi
    if (lokasi && lokasi !== "Semua Lokasi") {
      query += ` AND lk.lokasi = ? `;
      params.push(lokasi);
    }

    // Filter Kategori -> sebenarnya = tipe_pekerjaan
    if (kategori && kategori !== "Semua Pekerjaan") {
      query += ` AND lk.tipe_pekerjaan = ? `;
      params.push(kategori);
    }

    const [rows] = await db.execute(query, params);
    await db.end();

    return NextResponse.json({ success: true, data: rows });

  } catch (error) {
    console.error("API Cari Lowongan Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat hasil pencarian.", error: error.message },
      { status: 500 }
    );
  }
}