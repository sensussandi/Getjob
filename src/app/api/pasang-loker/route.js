import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      nama_posisi,
      tanggal_dibuka,
      tanggal_ditutup,
      deskripsi_pekerjaan,
      kualifikasi,
      gaji,
      lokasi,
    } = body;

    // Validasi minimal
    if (!nama_posisi || !tanggal_dibuka || !deskripsi_pekerjaan) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap. Mohon isi semua field wajib." },
        { status: 400 }
      );
    }

    // Koneksi ke database MySQL
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Query insert ke tabel lowongan_kerja
    await connection.execute(
      "INSERT INTO lowongan_kerja (nama_posisi, tanggal_dibuka, tanggal_ditutup, deskripsi_pekerjaan, kualifikasi, gaji, lokasi) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nama_posisi,
        tanggal_dibuka,
        tanggal_ditutup,
        deskripsi_pekerjaan,
        kualifikasi,
        gaji,
        lokasi,
      ]
    );

    await connection.end();

    return NextResponse.json({
      success: true,
      message: "✅ Lowongan berhasil dipasang!",
    });
  } catch (error) {
    console.error("❌ ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memasang lowongan." },
      { status: 500 }
    );
  }
}
