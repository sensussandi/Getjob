import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function DELETE(req, context) {
  const { id } = await context.params;

  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Hapus perusahaan
    await db.query(`DELETE FROM admin_perusahaan WHERE id_admin = ?`, [id]);

    await db.end();

    return NextResponse.json({ success: true, message: "Berhasil menghapus perusahaan." });

  } catch (error) {
    console.error("Error delete perusahaan:", error);
    return NextResponse.json({ success: false, message: "Gagal menghapus" }, { status: 500 });
  }
}
