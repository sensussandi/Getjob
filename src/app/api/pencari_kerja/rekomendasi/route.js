import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

// GET method untuk rekomendasi lowongan
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

    // Ambil data user (prodi & keahlian)
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

    // Cek apakah keahlian kosong atau tidak
    if (!keahlian || keahlian.trim() === "") {
      await db.end();
      return NextResponse.json({
        success: false,
        emptySkill: true,  // Kirim tanda khusus
      });
    }

    const skillsArray = keahlian
      ? keahlian.split(",").map((s) => s.trim().toLowerCase())
      : [];

    const searchKeywords = [...skillsArray, prodi?.toLowerCase()].filter(Boolean);

    const [lowongan] = await db.query(`
      SELECT l.*, a.nama_perusahaan
      FROM lowongan_kerja l
      JOIN admin_perusahaan a ON l.id_admin = a.id_admin
    `);

    const hasilRekomendasi = lowongan.map((job) => {
      const teksGabungan = `${job.nama_posisi} ${job.deskripsi_pekerjaan} ${job.kualifikasi}`.toLowerCase();
      let skor = 0;

      // Pencarian sequential berdasarkan kata kunci (keahlian dan prodi)
      searchKeywords.forEach((key) => {
        if (teksGabungan.includes(key)) {
          skor += 1; // Tambah skor jika kata kunci ditemukan
        }
      });

      return { ...job, skor };
    });


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
