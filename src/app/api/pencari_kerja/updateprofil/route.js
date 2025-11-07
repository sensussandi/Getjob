import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prodi, keahlian } = await req.json();

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Contoh: nanti ganti sesuai user login aktif
    const nim = 235314020;

    const [update] = await db.execute(
      "UPDATE pencari_kerja SET prodi = ?, keahlian = ? WHERE nim = ?",
      [prodi, keahlian.join(", "), nim]
    );

    await db.end();

    if (update.affectedRows > 0) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
