import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Hapus perusahaan
    await db.query(`DELETE FROM pencari_kerja WHERE nim = ?`, [id]);

    await db.end();

    return NextResponse.json({ success: true, message: "Berhasil menghapus pencari kerja." });

  } catch (error) {
    console.error("Error delete pencari kerja:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus" }, { status: 500 });
  }
}
