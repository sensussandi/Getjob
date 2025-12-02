import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id_pendaftaran, status } = body;

    if (!id_pendaftaran || !status) {
      return NextResponse.json({
        success: false,
        message: "id_pendaftaran dan status wajib dikirim",
      });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    await db.execute(
      `UPDATE mendaftar SET status_pendaftaran = ? WHERE id_pendaftaran = ?`,
      [status, id_pendaftaran]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Status berhasil diperbarui",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: err.message,
    });
  }
}
