import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function PUT(req, context) {
  try {
    const { id } = await context.params;  // params harus di await
    const body = await req.json();
    const { nama_posisi, deskripsi_pekerjaan, kualifikasi, tipe_pekerjaan, tingkat_pengalaman, prodi, keahlian, gaji, lokasi, tanggal_ditutup } = body;

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const { searchParams } = new URL(req.url);
    const id_admin = searchParams.get("id") || ("id_admin");
    
    if (!id_admin) {  
      return NextResponse.json({ success: false, message: "ID admin wajib dikirim" });
    }

    await db.execute(
      `UPDATE lowongan_kerja SET nama_posisi=?, deskripsi_pekerjaan=?, kualifikasi=?, tipe_pekerjaan=?, tingkat_pengalaman=?, prodi=?, keahlian=?, gaji=?, lokasi=?, tanggal_ditutup=? WHERE id_lowongan=?`,
      [nama_posisi, deskripsi_pekerjaan, kualifikasi, tipe_pekerjaan, tingkat_pengalaman, prodi, keahlian, gaji, lokasi, tanggal_ditutup, id]
    );

    return NextResponse.json({ success: true, message: "Lowongan berhasil diupdate" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal update lowongan" });
  }
}
