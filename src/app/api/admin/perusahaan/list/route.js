import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function GET() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute("SELECT id_admin, nama_perusahaan FROM admin_perusahaan");

    await db.end();

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Gagal memuat daftar perusahaan" },
      { status: 500 }
    );
  }
}
