import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// API untuk menampilkan semua lowongan yang sudah didaftarkan oleh user
export async function GET(req) {
    let db;
    try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");

    if (!nim) {
        return NextResponse.json(
        { success: false, message: "NIM tidak dikirim!" },
        { status: 400 }
        );
    }

    // Koneksi database
    db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "getjob_db",
    });

    // Query disesuaikan dengan tabel kamu
    const [rows] = await db.execute(
        `
        SELECT 
        m.id_pendaftaran,
        m.status_pendaftaran,
        m.tanggal_daftar,
        l.id_lowongan,
        l.nama_posisi,
        l.lokasi,
        l.gaji,
        l.tanggal_ditutup,
        a.nama_perusahaan
        FROM mendaftar m
        JOIN lowongan_kerja l ON m.id_lowongan = l.id_lowongan
        JOIN admin_perusahaan a ON l.id_admin = a.id_admin
        WHERE m.nim = ?
        ORDER BY m.tanggal_daftar DESC
        `,
        [nim]
    );

    await db.end();

    return NextResponse.json({
        success: true,
        data: rows,
    });
    } catch (error) {
    console.error("GET /api/lihatLokerSaya error:", error);
    return NextResponse.json(
        {
        success: false,
        message: "Gagal memuat data pendaftaran!",
        error: error.message,
        },
        { status: 500 }
    );
    } finally {
    if (db) await db.end().catch(() => {});
    }
}