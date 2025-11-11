import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const db = await mysql.createConnection({
      host: "127.0.0.1", // atau "localhost" kalau MySQL kamu aktif di situ
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // hapus lowongan
    await db.execute("DELETE FROM lowongan_kerja WHERE id_lowongan = ?", [id]);
    await db.end();

    return NextResponse.json({ success: true, message: "Lowongan berhasil dihapus" });
  } catch (error) {
    console.error("❌ Error hapus lowongan:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus lowongan" },
      { status: 500 }
    );
  }
}
