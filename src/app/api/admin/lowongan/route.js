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

    const [rows] = await db.execute("SELECT * FROM lowongan_kerja ORDER BY id_lowongan DESC");
    await db.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error mengambil data lowongan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data lowongan" },
      { status: 500 }
    );
  }
}
