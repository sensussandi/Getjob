import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID wajib dikirim" });
    }
    
    // === 1. Semua perusahaan ===
    const [adminPerusahaan] = await db.query(`
      SELECT 
        id_admin,
        nama_perusahaan,
        email_perusahaan,
        alamat_perusahaan,
        tentang_perusahaan,
        logo_url,
        no_telepone,
        role
      FROM admin_perusahaan
      ORDER BY id_admin DESC
    `);

    // === 2. Semua pencari kerja ===
    const [pencaker] = await db.query(`
      SELECT *
      FROM pencari_kerja
      ORDER BY nim DESC
    `);


    // === 3. Semua lowongan kerja ===
    const [lowongan] = await db.query(`
      SELECT 
        l.*,
        a.nama_perusahaan,

        -- === Hitung jumlah pelamar per lowongan ===
        (
          SELECT COUNT(*) 
          FROM mendaftar m 
          WHERE m.id_lowongan = l.id_lowongan
        ) AS jumlah_pelamar

      FROM lowongan_kerja l
      LEFT JOIN admin_perusahaan a ON l.id_admin = a.id_admin
      ORDER BY l.id_lowongan DESC
    `);
    

    // === 4. Statistik ===
    const stats = {
      totalPerusahaan: adminPerusahaan.length,
      totalPencaker: pencaker.length,
      totalLowongan: lowongan.length,
    };

    await db.end();

    return NextResponse.json({
      success: true,
      adminPerusahaan,
      pencaker,
      lowongan,
      stats,
    });

  } catch (error) {
    console.error("Error mengambil data:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}
