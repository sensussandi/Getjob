import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

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
      tipe_pekerjaan,
      tingkat_pengalaman,
      external_url,
    } = body;

    // VALIDASI WAJIB
    if (
      !nama_posisi ||
      !deskripsi_pekerjaan ||
      !kualifikasi ||
      !gaji ||
      !lokasi ||
      !tanggal_ditutup ||
      !tipe_pekerjaan ||
      !tingkat_pengalaman
    ) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    // VALIDASI URL (opsional)
    let linkFinal = null;
    if (external_url) {
      try {
        const parsed = new URL(external_url);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("Invalid URL");
        }
        linkFinal = external_url;
      } catch {
        return NextResponse.json(
          { success: false, message: "Format link eksternal tidak valid!" },
          { status: 400 }
        );
      }
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // auto generate tanggal dibuka
    const tanggal_dibuka = new Date().toISOString().split("T")[0];

    // sementara (belum ambil dari session perusahaan)
    const id_admin = 1;

    // INSERT (sudah ditambahkan kolom baru)
    await db.query(
      `INSERT INTO lowongan_kerja 
        (id_admin, nama_posisi, tanggal_dibuka, tanggal_ditutup,
         deskripsi_pekerjaan, kualifikasi, gaji, lokasi,
         tipe_pekerjaan, tingkat_pengalaman, external_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_admin,
        nama_posisi,
        tanggal_dibuka,
        tanggal_ditutup,
        deskripsi_pekerjaan,
        kualifikasi,
        gaji,
        lokasi,
        tipe_pekerjaan,
        tingkat_pengalaman,
        linkFinal,
      ]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Lowongan berhasil ditambahkan!",
    });
  } catch (err) {
    console.error("❌ Error tambah lowongan:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}