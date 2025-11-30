import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_mendaftar = searchParams.get("id_mendaftar");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute(
      `
      SELECT 
        m.id_mendaftar,
        m.id_lowongan,
        m.id AS nim,
        m.status,
        m.tanggal_input,

        p.nama_lengkap,
        p.email,
        p.no_telephone,
        p.prodi,
        p.pendidikan_terakhir,
        p.keahlian,
        p.linkedin,
        p.foto,
        p.cv,
        p.tentang_anda,
        p.alamat,
        p.jenis_kelamin,
        p.tanggal_lahir,

        l.nama_posisi,
        l.lokasi
      FROM mendaftar m
      JOIN pencari_kerja p ON m.id = p.nim
      JOIN lowongan_kerja l ON m.id_lowongan = l.id_lowongan
      WHERE m.id_mendaftar = ?
      `,
      [id_mendaftar]
    );

    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" });
    }

    return NextResponse.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
