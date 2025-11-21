import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    // CONNECT DB
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const { searchParams } = new URL(req.url);
    const id_admin = searchParams.get("id_admin");

    if (!id_admin) {
      return NextResponse.json({ success: false, message: "ID admin wajib dikirim" });
    }

    // -------------------------
    // 1. DATA ADMIN PERUSAHAAN
    // -------------------------
    const [adminRes] = await db.query(
      `
      SELECT 
        id_admin,
        nama_perusahaan,
        alamat_perusahaan,
        email_perusahaan AS email,
        tentang_perusahaan,
        logo_url
      FROM admin_perusahaan
      WHERE id_admin = ?
      `,
      [id_admin]
    );

    const admin = adminRes[0];

    // -------------------------
    // 2. LOWONGAN PERUSAHAAN
    // -------------------------
    const [lowongan] = await db.query(
      `
      SELECT 
        id_lowongan,
        nama_posisi,
        lokasi,
        deskripsi_pekerjaan,
        tanggal_ditutup
      FROM lowongan_kerja
      WHERE id_admin = ?
      ORDER BY id_lowongan DESC
      `,
      [id_admin]
    );

    // -------------------------
    // 3. PELAMAR TERBARU
    // -------------------------
    const [pelamar] = await db.query(
      `
      SELECT 
        m.id_pendaftaran AS id,
        m.status_pendaftaran AS status,
        m.tanggal_daftar AS tanggal_input,
        p.nama_lengkap AS nama_pelamar,
        l.nama_posisi
      FROM mendaftar m
      JOIN pencari_kerja p ON m.nim = p.nim
      JOIN lowongan_kerja l ON m.id_lowongan = l.id_lowongan
      WHERE l.id_admin = ?
      ORDER BY m.tanggal_daftar DESC
      LIMIT 5
      `,
      [id_admin]
    );

    // -------------------------
    // 4. STATISTIK
    // -------------------------
    const [statsRes] = await db.query(
      `
      SELECT
        (SELECT COUNT(*) FROM lowongan_kerja WHERE id_admin = ?) AS totalLowongan,
        -- Jumlah lowongan aktif (bisa disamakan, tapi disiapkan kalau nanti kamu ingin beda kriteria)
        (SELECT COUNT(*) FROM lowongan_kerja WHERE id_admin = ? AND tanggal_ditutup >= CURDATE() ) AS lowonganAktif,
        (SELECT COUNT(*) FROM mendaftar m 
          JOIN lowongan_kerja l 
          ON m.id_lowongan = l.id_lowongan 
          WHERE l.id_admin = ?) AS totalPelamar,
        (SELECT COUNT(*) FROM mendaftar m 
          JOIN lowongan_kerja l 
          ON m.id_lowongan = l.id_lowongan 
          WHERE l.id_admin = ? 
          AND DATE(m.tanggal_daftar) = CURDATE()) AS pelamarBaru
      `,
      [id_admin, id_admin, id_admin, id_admin]
    );

    const stats = statsRes[0];

    await db.end();

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
