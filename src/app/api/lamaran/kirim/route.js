import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("LAMARAN BODY:", body);

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

    // Cek sudah pernah melamar
    const [cek] = await db.query(
      "SELECT * FROM mendaftar WHERE id_lowongan=? AND nim=?",
      [id_lowongan, nim]
    );

    console.log("CHECK DUPLICATE:", cek);

    if (cek.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Anda sudah melamar lowongan ini.",
      });
    }

    await db.query(
      `INSERT INTO mendaftar (id_lowongan, nim, status_pendaftaran, tanggal_daftar)
      VALUES (?, ?, 'menunggu', NOW())`,
      [id_lowongan, nim]
    );

    await db.end();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("LAMARAN ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}