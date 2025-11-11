import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();
  const { nama_posisi, deskripsi_pekerjaan, kualifikasi, gaji, lokasi, tanggal_ditutup } = body;

  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob",
    });

    await db.execute(
      `UPDATE lowongan_kerja SET nama_posisi=?, deskripsi_pekerjaan=?, kualifikasi=?, gaji=?, lokasi=?, tanggal_ditutup=? WHERE id_lowongan=?`,
      [nama_posisi, deskripsi_pekerjaan, kualifikasi, gaji, lokasi, tanggal_ditutup, id]
    );

    return NextResponse.json({ success: true, message: "Lowongan berhasil diupdate" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal update lowongan" });
  }
}
