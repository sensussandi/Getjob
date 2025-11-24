import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");   // Pencari Kerja pakai "nim"
    // Ambil data dari body request
    if (!nim) {
      return NextResponse.json({
        success: false,
        message: "nim pencari kerja tidak ditemukan",
      });
    }

    const body = await req.json();
    const { prodi, keahlian } = body;

    // Validasi input
    if (!prodi || !keahlian || keahlian.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Data prodi dan keahlian wajib diisi!",
      });
    }

    

    // Koneksi ke database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Pastikan user ada di tabel
    const [checkUser] = await db.execute("SELECT * FROM pencari_kerja WHERE nim = ?", [nim]);

    if (checkUser.length === 0) {
      // Jika user belum ada, buat data baru
      await db.execute(
        "INSERT INTO pencari_kerja (nim, prodi, keahlian) VALUES (?, ?, ?)",
        [nim, prodi, keahlian.join(", ")]
      );
    } else {
      // Jika sudah ada, update data
      await db.execute(
        "UPDATE pencari_kerja SET prodi = ?, keahlian = ? WHERE nim = ?",
        [prodi, keahlian.join(", "), nim]
      );
    }

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Data profil berhasil disimpan!",
    });
  } catch (error) {
    console.error("❌ Error di updateProfil:", error);
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
}
