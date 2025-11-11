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
      external_url, // ✅ tambahkan field sbaru
    } = body;

    // ✅ Validasi input wajib
        if (
          !nama_posisi ||
          !deskripsi_pekerjaan ||
          !kualifikasi ||
          !gaji ||
          !lokasi ||
          !tanggal_ditutup
        ) {
          return NextResponse.json(
            { success: false, message: "Semua field wajib diisi." },
            { status: 400 }
          );
        }
    
        // ✅ Validasi URL (kalau diisi)
        let linkFinal = null;
        if (external_url) {
          try {
            const parsed = new URL(external_url);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
              throw new Error("URL tidak valid");
            }
            linkFinal = external_url;
          } catch {
            return NextResponse.json(
              { success: false, message: "Format link eksternal tidak valid!" },
              { status: 400 }
            );
          }
        }
    
        // ✅ Koneksi ke database MySQL
        const db = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "", // isi kalau MySQL kamu pakai password
          database: "getjob_db",
        });
    
        // ✅ Data tambahan otomatis
        const tanggal_dibuka = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
        const id_admin = 1; // sementara, nanti ambil dari session login perusahaan
    
        // ✅ Query INSERT (tambahkan kolom external_url)
        await db.query(
          `INSERT INTO lowongan_kerja 
          (id_admin, nama_posisi, tanggal_dibuka, tanggal_ditutup, deskripsi_pekerjaan, kualifikasi, gaji, lokasi, external_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id_admin,
            nama_posisi,
            tanggal_dibuka,
            tanggal_ditutup,
            deskripsi_pekerjaan,
            kualifikasi,
            gaji,
            lokasi,
            linkFinal, // ✅ simpan link eksternal
          ]
        );
    
        await db.end();
    
        return NextResponse.json({
          success: true,
          message: "✅ Lowongan berhasil ditambahkan!",
        });
      } catch (err) {
        console.error("❌ Error tambah lowongan:", err);
        return NextResponse.json(
          { success: false, message: "Terjadi kesalahan pada server." },
          { status: 500 }
        );
      }
    }
    