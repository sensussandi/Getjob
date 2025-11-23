import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const nim = user?.nim;


    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // 🔹 Ambil data user (prodi & keahlian)
    const [userRows] = await db.execute(
      "SELECT prodi, keahlian FROM pencari_kerja WHERE nim = ?",
      [nim]
    );

    if (userRows.length === 0) {
      await db.end();
      return NextResponse.json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    const { prodi, keahlian } = userRows[0];
    const skillsArray = keahlian
      ? keahlian.split(",").map((s) => s.trim().toLowerCase())
      : [];

    // 🔹 Gabungkan prodi + keahlian menjadi keyword
    const searchKeywords = [...skillsArray, prodi?.toLowerCase()].filter(Boolean);

    // 🔹 Ambil semua lowongan kerja beserta nama perusahaan
    const [lowongan] = await db.query(`
      SELECT l.*, a.nama_perusahaan
      FROM lowongan_kerja l
      JOIN admin_perusahaan a ON l.id_admin_perusahaan = a.id_admin
    `);

    // 🔹 Hitung skor relevansi berdasarkan kecocokan keyword
    const hasilRekomendasi = lowongan.map((job) => {
      const teksGabungan = `${job.nama_posisi} ${job.deskripsi_pekerjaan} ${job.kualifikasi}`
        .toLowerCase();
      let skor = 0;
      searchKeywords.forEach((key) => {
        if (teksGabungan.includes(key)) skor += 1;
      });
      return { ...job, skor };
    });

    // 🔹 Urutkan dari skor tertinggi ke terendah
    hasilRekomendasi.sort((a, b) => b.skor - a.skor);

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Rekomendasi berhasil diambil.",
      lowongan: hasilRekomendasi,
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
