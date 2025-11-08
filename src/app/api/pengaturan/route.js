import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

//  Ambil data user berdasarkan NIM
export async function GET(req) {
    try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");

    if (!nim) {
        return NextResponse.json({
        success: false,
        message: "Parameter NIM tidak ditemukan!",
        });
    }

    // Koneksi database
    const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "getjob_db",
    });

    // Jalankan query ambil user
    const [rows] = await db.execute("SELECT nim, nama_lengkap, email, no_telephone, password FROM pencari_kerja WHERE nim = ?", [nim]);
    await db.end();

    if (rows.length === 0) {
        return NextResponse.json({
        success: false,
        message: "Data user tidak ditemukan di database!",
        });
    }

    // Kembalikan data user
    return NextResponse.json({
        success: true,
        user: rows[0],
    });
    } catch (error) {
    console.error("GET /api/pengaturan error:", error);
    return NextResponse.json({
        success: false,
        message: "Terjadi kesalahan saat mengambil data user.",
        error: error.message,
    });
    }
}

// Simpan perubahan data user
export async function POST(req) {
    try {
    const body = await req.json();
    const { nama_lengkap, email, no_telephone, password, nim } = body;

    if (!nim) {
        return NextResponse.json({ success: false, message: "NIM user tidak ditemukan!" }, { status: 400 });
    }

    // Koneksi ke database
    const db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "getjob_db",
    });

    // Jalankan query update
    const [result] = await db.execute(
        `UPDATE pencari_kerja 
            SET nama_lengkap = ?, email = ?, no_telephone = ?, password = ?
            WHERE nim = ?`,
        [nama_lengkap, email, no_telephone, password, nim]
    );

    await db.end();

    if (result.affectedRows === 0) {
        return NextResponse.json({
        success: false,
        message: "Tidak ada data yang diperbarui (NIM tidak ditemukan).",
        });
    }

    return NextResponse.json({
        success: true,
        message: "✅ Pengaturan berhasil diperbarui!",
    });
    } catch (error) {
    console.error("POST /api/pengaturan error:", error);
    return NextResponse.json({ success: false, message: "Gagal memperbarui pengaturan.", error: error.message }, { status: 500 });
    }
}
