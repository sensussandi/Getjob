import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_admin = searchParams.get("id_admin");

    if (!id_admin)
      return NextResponse.json({
        success: false,
        message: "id_admin diperlukan",
      });

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute(
      `
      SELECT 
        m.id_pendaftaran,
        m.id_lowongan,
        m.nim,
        m.status_pendaftaran,
        m.tanggal_daftar,

        -- Data dari pencari_kerja
        p.nama_lengkap,
        p.tanggal_lahir,
        p.jenis_kelamin,
        p.alamat,
        p.email,
        p.no_telephone,
        p.prodi,
        p.pendidikan_terakhir,
        p.linkedin,
        p.keahlian,
        p.foto,
        p.tentang_anda,
        p.cv,
        p.role,

        -- Data lowongan
        l.nama_posisi,
        l.lokasi,
        l.gaji,
        l.deskripsi_pekerjaan,
        l.kualifikasi,
        l.tipe_pekerjaan

      FROM mendaftar m
      JOIN pencari_kerja p ON m.nim = p.nim
      JOIN lowongan_kerja l ON m.id_lowongan = l.id_lowongan

      WHERE l.id_admin = ?
      ORDER BY m.id_pendaftaran DESC
      `,
      [id_admin]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      data: rows,
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
