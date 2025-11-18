import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id_lowongan, id_mahasiswa } = body;

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Cek apakah user sudah pernah melamar
    const [cek] = await db.query(
      `SELECT * FROM mendaftar WHERE id_lowongan=? AND id_mahasiswa=?`,
      [id_lowongan, id_mahasiswa]
    );

    if (cek.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Anda sudah melamar lowongan ini.",
      });
    }

    await db.query(
      `INSERT INTO mendaftar (id_lowongan, id_mahasiswa, tanggal) VALUES (?, ?, NOW())`,
      [id_lowongan, id_mahasiswa]
    );

    await db.end();

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Gagal mengirim lamaran" },
      { status: 500 }
    );
  }
}
