import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Ambil profil user
    const [userRows] = await db.execute(
      "SELECT prodi, keahlian FROM pencari_kerja WHERE nim = ?",
      [nim]
    );

    if (userRows.length === 0) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan." });
    }

    const { prodi, keahlian } = userRows[0];

    // Jika user belum mengisi keahlian ⇒ redirect
    if (!keahlian || keahlian.trim() === "") {
      return NextResponse.json({ success: false, emptySkill: true });
    }

    // Ubah string jadi array
    const prodiUser = prodi?.toLowerCase();
    const skillsUser = keahlian.split(",").map((s) => s.trim().toLowerCase());

    // Ambil semua lowongan
    const [lowongan] = await db.execute(`
      SELECT l.*, a.nama_perusahaan
      FROM lowongan_kerja l
      JOIN admin_perusahaan a ON l.id_admin = a.id_admin
    `);

    await db.end();

    // ================================
    //        SEQUENTIAL SEARCH
    // ================================
    const hasil = lowongan.map((job) => {
      let skor = 0;

      const teksJob = `
        ${job.nama_posisi}
        ${job.deskripsi_pekerjaan}
        ${job.kualifikasi}
        ${job.tipe_pekerjaan}
        ${job.tingkat_pengalaman}
        ${job.prodi}
        ${job.keahlian}
      `.toLowerCase();

      // 1. Cocokkan prodi user dengan lowongan
      if (prodiUser && teksJob.includes(prodiUser)) skor += 3;

      // 2. Cocokkan semua keahlian
      skillsUser.forEach((skill) => {
        if (teksJob.includes(skill)) skor += 2;
      });

      // 3. Bonus jika nama posisi mengandung skill
      skillsUser.forEach((skill) => {
        if (job.nama_posisi?.toLowerCase().includes(skill)) skor += 1;
      });

      return { ...job, skor };
    });

    // Urutkan dari skor terbesar
    hasil.sort((a, b) => b.skor - a.skor);

    return NextResponse.json({
      success: true,
      message: "Rekomendasi berhasil diambil.",
      lowongan: hasil,
    });

  } catch (error) {
    console.error("❌ Error rekomendasi:", error);
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
}

// POST method untuk mereset keahlian
export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const nim = searchParams.get("nim");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Reset keahlian menjadi kosong (null)
    const [result] = await db.execute(
      "UPDATE pencari_kerja SET keahlian = ? WHERE nim = ?",
      [null, nim]
    );

    await db.end();

    if (result.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        message: "User tidak ditemukan atau keahlian gagal direset.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Keahlian berhasil direset.",
    });
  } catch (error) {
    console.error("❌ Error mereset keahlian:", error);
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
}
