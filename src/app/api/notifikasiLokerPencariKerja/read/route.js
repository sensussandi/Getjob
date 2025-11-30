import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    const { id_pendaftaran } = await req.json();

    if (!id_pendaftaran) {
      return NextResponse.json({
        success: false,
        message: "id_pendaftaran wajib dikirim",
      });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    await db.execute(
      `
      UPDATE mendaftar
      SET is_read = 1
      WHERE id_pendaftaran = ?
      `,
      [id_pendaftaran]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Notifikasi ditandai sebagai dibaca",
    });
  } catch (err) {
    console.error("ERR UPDATE NOTIF:", err);
    return NextResponse.json({ success: false, message: "Gagal update" }, { status: 500 });
  }
}
