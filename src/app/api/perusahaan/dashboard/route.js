import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    // ✅ 1. Koneksi ke database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // ✅ 2. Ambil data perusahaan pertama
    const [adminRes] = await db.query(`SELECT * FROM admin_perusahaan LIMIT 1`);
    const admin = adminRes[0];

    // ✅ 3. Ambil data lowongan kerja
    const [lowongan] = await db.query(`
      SELECT 
        id_lowongan,
        nama_posisi,
        gaji,
        lokasi,
        kualifikasi,
        deskripsi_pekerjaan,
        tanggal_ditutup
      FROM lowongan_kerja
      ORDER BY id_lowongan DESC
      LIMIT 10
    `);

    // ✅ 4. Ambil pelamar terbaru — disesuaikan ke struktur tabel kamu
    //    Karena tabel mendaftar TIDAK punya kolom nim dan id_lowongan,
    //    maka di sini kita tampilkan data dasar saja.
    const [pelamar] = await db.query(`
      SELECT 
        id_pendaftaran AS id,
        status_pendaftaran AS status,
        tanggal_daftar AS tanggal_input
      FROM mendaftar
      ORDER BY tanggal_daftar DESC
      LIMIT 5
    `);

    // ✅ 5. Statistik sederhana (tanpa join)
    const [statsRes] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM lowongan_kerja) AS totalLowongan,
        (SELECT COUNT(*) FROM lowongan_kerja) AS lowonganAktif,
        (SELECT COUNT(*) FROM mendaftar) AS totalPelamar,
        (SELECT COUNT(*) FROM mendaftar WHERE DATE(tanggal_daftar) = CURDATE()) AS pelamarBaru
    `);

    const stats = statsRes[0];

    await db.end();

    // ✅ 6. Kirim hasil ke frontend
    return NextResponse.json({
      success: true,
      admin,
      lowongan,
      pelamar,
      stats,
    });

  } catch (err) {
    console.error("❌ ERROR DASHBOARD:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dari database",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
