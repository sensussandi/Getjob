import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nama_posisi, deskripsi_pekerjaan, kualifikasi, gaji, lokasi, tanggal_ditutup } = body;

    // ✅ Validasi input
    if (!nama_posisi || !deskripsi_pekerjaan || !kualifikasi || !gaji || !lokasi || !tanggal_ditutup) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    // ✅ Koneksi ke MySQL
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "", // isi kalau MySQL kamu pakai password
      database: "getjob_db",
    });

    // ✅ Data tambahan otomatis
    const tanggal_dibuka = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
    const id_admin = 1; // sementara, nanti ambil dari session login perusahaan

    // ✅ Query INSERT (pakai kolom id_admin)
    await db.query(
      `INSERT INTO lowongan_kerja 
      (id_admin, nama_posisi, tanggal_dibuka, tanggal_ditutup, deskripsi_pekerjaan, kualifikasi, gaji, lokasi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_admin, nama_posisi, tanggal_dibuka, tanggal_ditutup, deskripsi_pekerjaan, kualifikasi, gaji, lokasi]
    );

    db.end();

    return NextResponse.json({
      success: true,
      message: "✅ Lowongan berhasil ditambahkan!",
    });
  } catch (err) {
    console.error("❌ Error tambah lowongan:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
