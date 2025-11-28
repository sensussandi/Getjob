import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { nim } = await req.json();

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    await db.execute(
      "UPDATE pencari_kerja SET reset_request = 1 WHERE nim = ?",
      [nim]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Permintaan reset password telah dikirim ke Admin.",
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
