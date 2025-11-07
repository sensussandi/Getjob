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

    const [rows] = await db.execute("SELECT * FROM admin_perusahaan ORDER BY id_admin DESC");
    await db.end();

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error mengambil data perusahaan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data perusahaan" },
      { status: 500 }
    );
  }
}
