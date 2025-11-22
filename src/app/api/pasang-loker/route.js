import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// === KONFIGURASI DATABASE ===
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // isi jika ada password MySQL kamu
  database: "getjob", // ubah sesuai nama database
};

// === POST: Simpan data lowongan baru ===
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      nama_posisi,
      deskripsi_pekerjaan,
      kualifikasi,
      gaji,
      lokasi,
      tanggal_ditutup,
      id_admin, // id perusahaan yang pasang loker
    } = body;

    // Validasi input wajib
    if (
      !nama_posisi ||
      !deskripsi_pekerjaan ||
      !kualifikasi ||
      !gaji ||
      !lokasi ||
      !tanggal_ditutup ||
      !id_admin
    ) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi!" },
        { status: 400 }
      );
    }

    // Koneksi ke database
    const db = await mysql.createConnection(dbConfig);

    // Simpan data ke tabel lowongan_kerja
    const [result] = await db.execute(
      `INSERT INTO lowongan_kerja 
      (nama_posisi, deskripsi_pekerjaan, kualifikasi, gaji, lokasi, tanggal_ditutup, id_admin)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama_posisi, deskripsi_pekerjaan, kualifikasi, gaji, lokasi, tanggal_ditutup, id_admin]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Lowongan berhasil ditambahkan!",
      insertedId: result.insertId,
    });
  } catch (error) {
    console.error("Error menambah loker:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}

// === GET: Ambil semua lowongan yang sudah dipasang ===
export async function GET() {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [rows] = await db.execute(
      `SELECT l.*, a.nama_perusahaan 
       FROM lowongan_kerja l 
       JOIN admin_perusahaan a ON l.id_admin = a.id_admin
       ORDER BY l.id_lowongan DESC`
    );
    await db.end();

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error mengambil data:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data", error: error.message },
      { status: 500 }
    );
  }
}
