import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("LAMARAN BODY:", body);  // <-- DEBUG
    const { id_lowongan, nim } = body;

    if (!id_lowongan || !nim) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap!" },
        { status: 400 }
      );
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Cek duplikasi
    const [cek] = await db.query(
      `SELECT * FROM mendaftar 
      WHERE id_lowongan = ? AND nim = ?`,
      [id_lowongan, nim]
    );
    console.log("CHECK RESULT:", cek);   // <-- DEBUG

    if (cek.length > 0) {
      return NextResponse.json({
        success: false,
        already: true,
        message: "Anda sudah melamar lowongan ini.",
      });
    }

    // Simpan lamaran
    await db.query(
      `INSERT INTO mendaftar (id_lowongan, nim, status_pendaftaran, tanggal_daftar)
      VALUES (?, ?, 'menunggu', CURDATE())`,
      [id_lowongan, nim]
    );

    return NextResponse.json({
      success: true,
      message: "Lamaran berhasil dikirim!"
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
