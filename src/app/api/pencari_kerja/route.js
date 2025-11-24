import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET(req) {
  try {
    // CONNECT DB
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");

    if (!nim) {
      return NextResponse.json({ success: false, message: "nim wajib dikirim" });
    }

    const rows = await db.query(
      `
      SELECT * FROM pencari_kerja
      WHERE nim = ?
      `,
      [nim]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      rows,
    });
  } catch (err) {
    console.error("❌ ERROR DASHBOARD:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data dashboard",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
