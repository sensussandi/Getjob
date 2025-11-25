import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nim, prodi, keahlian } = body;

    if (!nim) {
      return NextResponse.json({
        success: false,
        message: "NIM tidak ditemukan",
      });
    }

    if (!prodi || !keahlian || keahlian.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Prodi dan keahlian wajib diisi!",
      });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // cek user
    const [user] = await db.execute(
      "SELECT * FROM pencari_kerja WHERE nim = ?",
      [nim]
    );

    if (user.length === 0) {
      // insert baru
      await db.execute(
        "INSERT INTO pencari_kerja (nim, prodi, keahlian) VALUES (?, ?, ?)",
        [nim, prodi, keahlian.join(", ")]
      );
    } else {
      // update lama
      await db.execute(
        "UPDATE pencari_kerja SET prodi = ?, keahlian = ? WHERE nim = ?",
        [prodi, keahlian.join(", "), nim]
      );
    }

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Profil berhasil disimpan!",
    });
  } catch (err) {
    console.error("❌ ERROR update profil:", err);
    return NextResponse.json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
