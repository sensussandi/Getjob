import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute("SELECT * FROM pencari_kerja");

    await db.end();

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Gagal mengambil data pencari_kerja",
      error: error.message,
    });
  }
}
