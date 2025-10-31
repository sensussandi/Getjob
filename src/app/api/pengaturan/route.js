import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
    try {
    const body = await req.json();
    const { nama_lengkap, email, no_telephone, password, nim } = body;

    // Cek apakah NIM tersedia
    if (!nim) {
        return NextResponse.json(
        { success: false, message: "NIM user tidak ditemukan!" },
        { status: 400 }
        );
    }

    // Koneksi ke database
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "getjob_db",
    });

    // Jalankan query update berdasarkan NIM
    const [result] = await connection.execute(
        "UPDATE pencari_kerja SET nama_lengkap=?, email=?, no_telephone=?, password=? WHERE nim=?",
        [nama_lengkap, email, no_telephone, password, nim]
    );

    await connection.end();

    // Cek apakah ada baris yang terpengaruh
    if (result.affectedRows === 0) {
        return NextResponse.json({
        success: false,
        message: "Data user tidak ditemukan!",
        });
    }

    return NextResponse.json({
        success: true,
        message: "Data Berhasil Diperbarui!",
    });
    } catch (error) {
    console.error("ERROR:", error.message);
    return NextResponse.json(
        { success: false, message: "Gagal memperbarui pengaturan" },
        { status: 500 }
    );
    }
}
