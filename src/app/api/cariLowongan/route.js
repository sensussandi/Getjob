import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const keyword = (searchParams.get("keyword") || "").trim();
    const lokasi = searchParams.get("lokasi") || "Semua Lokasi";
    const kategori = searchParams.get("kategori") || "Semua Pekerjaan"; // sekarang belum dipakai dulu

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // mulai dengan WHERE 1=1 supaya mudah nambah AND dinamis
    let query = `
      SELECT 
        l.*,
        a.nama_perusahaan
      FROM lowongan_kerja l
      JOIN admin_perusahaan a ON a.id_admin = l.id_admin
      WHERE 1=1
    `;

    const params = [];

    // FILTER KEYWORD
    if (keyword) {
      query += `
        AND (
          l.nama_posisi LIKE ?
          OR l.deskripsi_pekerjaan LIKE ?
          OR l.kualifikasi LIKE ?
        )
      `;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    // FILTER LOKASI (kecuali "Semua Lokasi")
    if (lokasi && lokasi !== "Semua Lokasi") {
      query += ` AND l.lokasi = ? `;
      params.push(lokasi);
    }

    // 💼 FILTER KATEGORI
    // ⚠️ sekarang dropdown-mu berisi "IT/Software Development, Marketing, ..."
    // sedangkan di tabel TIDAK ADA kolom 'kategori' seperti itu.
    // Ada 'tipe_pekerjaan', 'prodi', dll.
    // Jadi SEMENTARA ini kita abaikan filter kategori supaya tidak mengosongkan hasil.
    //
    // Nanti kalau sudah punya kolom kategori di DB baru diaktifkan.
    //
    // if (kategori && kategori !== "Semua Pekerjaan") {
    //   query += ` AND l.tipe_pekerjaan = ? `;
    //   params.push(kategori);
    // }

    // urutkan di paling akhir
    query += ` ORDER BY l.id_lowongan DESC`;

    const [rows] = await db.execute(query, params);
    await db.end();

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("API Cari Lowongan Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat hasil pencarian.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
