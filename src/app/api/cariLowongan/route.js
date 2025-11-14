import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
    let db;
    try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || "";
    const lokasi = searchParams.get("lokasi") || "";
    const kategori = searchParams.get("kategori") || "";

    db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "getjob_db",
    });

    let query = `
        SELECT 
        l.id_lowongan,
        l.nama_posisi,
        l.lokasi,
        l.gaji,
        l.tanggal_ditutup,
        a.nama_perusahaan
        FROM lowongan_kerja l
        JOIN admin_perusahaan a ON l.id_admin = a.id_admin
        WHERE 1=1
    `;
    const params = [];

    if (keyword) {
        query += ` AND (l.nama_posisi LIKE ? OR a.nama_perusahaan LIKE ?)`;
        params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (lokasi && lokasi !== "Semua Lokasi") {
        query += ` AND l.lokasi LIKE ?`;
        params.push(`%${lokasi}%`);
    }

    if (kategori && kategori !== "Semua Pekerjaan") {
        query += ` AND l.nama_posisi LIKE ?`;
        params.push(`%${kategori}%`);
    }

    query += ` ORDER BY l.tanggal_ditutup ASC`;

    const [rows] = await db.execute(query, params);

    return NextResponse.json({ success: true, data: rows });
    } catch (error) {
    console.error("❌ Error /api/cariLowongan:", error);
    return NextResponse.json(
        { success: false, message: "Gagal memuat data!", error: error.message },
        { status: 500 }
    );
    } finally {
    if (db) await db.end().catch(() => {});
    }
}