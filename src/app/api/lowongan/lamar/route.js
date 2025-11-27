import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id_lowongan, id} = await req.json();

    if (!id_lowongan || !id) {
      return NextResponse.json({
        success: false,
        message: "Data tidak lengkap (id_lowongan & nim wajib diisi)",
      });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // 1️⃣ CEK APA SUDAH MELAMAR
    const [cek] = await db.execute(
      "SELECT * FROM mendaftar WHERE id_lowongan = ? AND nim = ?",
      [id_lowongan, id]
    );

    if (cek.length > 0) {
      await db.end();
      return NextResponse.json({
        success: false,
        already: true,
        message: "Anda sudah melamar lowongan ini.",
      });
    }

    // 2️⃣ SIMPAN LAMARAN
    const tanggal_daftar = new Date().toISOString().split("T")[0];

    await db.execute(
      `INSERT INTO mendaftar 
        (id_lowongan, nim, status_pendaftaran, tanggal_daftar) 
       VALUES (?, ?, ?, ?)`,
      [id_lowongan, id, "menunggu", tanggal_daftar]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Lamaran berhasil dikirim!",
    });

  } catch (err) {
    console.error("❌ ERROR LAMAR:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
