import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    // Sementara ID admin hardcoded (nanti ambil dari session)
    const { searchParams } = new URL(req.url);
    const id_admin =  searchParams.get("id_admin");

    if (!id_admin) {
      return NextResponse.json(
        { success: false, message: "ID admin wajib dikirim" },
        { status: 400 }
      );
    }
    console.log("ID ADMIN DITERIMA:", id_admin);

    const body = await req.json();

    const { nama_posisi, deskripsi_pekerjaan, kualifikasi, gaji, lokasi, tanggal_ditutup, external_url, tipe_pekerjaan, tingkat_pengalaman, prodi, keahlian } = body;

    if (!nama_posisi || !deskripsi_pekerjaan || !kualifikasi || !gaji || !lokasi || !tanggal_ditutup || !tipe_pekerjaan || !tingkat_pengalaman || !prodi || !keahlian) {
      return NextResponse.json({ success: false, message: "Semua field wajib diisi." }, { status: 400 });
    }

    // Validasi URL eksternal (opsional)
    let linkFinal = null;

    if (external_url && external_url.trim() !== "") {
      try {
        const parsed = new URL(external_url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("Invalid URL");
        }
        linkFinal = external_url;
      } catch {
        return NextResponse.json({ success: false, message: "Format link eksternal tidak valid!" }, { status: 400 });
      }
    }

    // Koneksi database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const tanggal_dibuka = new Date().toISOString().split("T")[0];


    // Query lengkap INSERT
    const query = `
      INSERT INTO lowongan_kerja 
      (id_admin, nama_posisi, tanggal_dibuka, tanggal_ditutup, deskripsi_pekerjaan, kualifikasi, gaji, lokasi, external_url, tipe_pekerjaan, tingkat_pengalaman, prodi, keahlian)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [id_admin, nama_posisi, tanggal_dibuka, tanggal_ditutup, deskripsi_pekerjaan, kualifikasi, gaji, lokasi, linkFinal, tipe_pekerjaan, tingkat_pengalaman, prodi, keahlian];

    await db.execute(query, values);
    await db.end();

    return NextResponse.json({
      success: true,
      message: "Lowongan berhasil ditambahkan!",
    });
  } catch (err) {
    console.error("❌ Error tambah lowongan:", err);
    return NextResponse.json({ success: false, message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
