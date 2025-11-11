import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    // ✅ 1. Koneksi database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // ✅ 2. Ambil profil perusahaan
    const [adminRes] = await db.query(`
      SELECT 
        nama_perusahaan,
        alamat_perusahaan,
        email_perusahaan AS email,
        tentang_perusahaan,
        logo_url
      FROM admin_perusahaan
      LIMIT 1
    `);
    const admin = adminRes[0];

    // ✅ 3. Ambil data lowongan kerja
      const [lowongan] = await db.query(`
      SELECT 
        id_lowongan,
        nama_posisi,
        lokasi,
        deskripsi_pekerjaan,
        tanggal_ditutup
      FROM lowongan_kerja
      WHERE tanggal_ditutup >= CURDATE()  -- hanya tampil yang belum tutup
      ORDER BY id_lowongan DESC
      LIMIT 10
    `);

    // ✅ 4. Ambil pelamar terbaru
    const [pelamar] = await db.query(`
      SELECT 
        id_pendaftaran AS id,
        status_pendaftaran AS status,
        tanggal_daftar AS tanggal_input
      FROM mendaftar
      ORDER BY tanggal_daftar DESC
      LIMIT 5
    `);

   // ✅ 5. Statistik hanya untuk lowongan yang masih aktif
const [statsRes] = await db.query(`
  SELECT
    -- Total semua lowongan yang belum tutup
    (SELECT COUNT(*) 
      FROM lowongan_kerja 
      WHERE tanggal_ditutup >= CURDATE()
    ) AS totalLowongan,

    -- Jumlah lowongan aktif (bisa disamakan, tapi disiapkan kalau nanti kamu ingin beda kriteria)
    (SELECT COUNT(*) 
      FROM lowongan_kerja 
      WHERE tanggal_ditutup >= CURDATE()
    ) AS lowonganAktif,

    -- Total pelamar
    (SELECT COUNT(*) FROM mendaftar) AS totalPelamar,

    -- Pelamar baru hari ini
    (SELECT COUNT(*) 
      FROM mendaftar 
      WHERE DATE(tanggal_daftar) = CURDATE()
    ) AS pelamarBaru
`);

    const stats = statsRes[0];

    // ✅ 6. Tutup koneksi database
    await db.end();

    // ✅ 7. Kirim semua hasil ke frontend
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
        message: "Gagal mengambil data dashboard",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
