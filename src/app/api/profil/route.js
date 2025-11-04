import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { getServerSession } from "next-auth"; // Ambil session login
import { authOptions } from "../auth/[...nextauth]/route"; // path ke nextAuth

export async function POST(req) {
  try {
    // Ambil data user dari session login
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.nim) {
      return NextResponse.json(
        { success: false, message: "User belum login!" },
        { status: 401 }
      );
    }

    const nim = session.user.nim; // Ambil NIM dari session

    // Ambil data form
    const formData = await req.formData();
    const photo = formData.get("photo");
    const prodi = formData.get("prodi");
    const about = formData.get("about");
    const cv = formData.get("cv");

    // Siapkan folder upload
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file, name) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(path.join(uploadDir, name), buffer);
    };

    // Simpan file dengan nama unik
    let fotoFileName = null;
    let cvFileName = null;

    if (photo) {
      fotoFileName = `${Date.now()}_${photo.name}`;
      await saveFile(photo, fotoFileName);
    }

    if (cv) {
      cvFileName = `${Date.now()}_${cv.name}`;
      await saveFile(cv, cvFileName);
    }

    // Koneksi ke MySQL
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Cek apakah user sudah ada
    const [rows] = await db.execute(
      "SELECT * FROM pencari_kerja WHERE nim = ?",
      [nim]
    );

    if (rows.length === 0) {
      // Jika belum ada, insert
      await db.execute(
        `INSERT INTO pencari_kerja (nim, prodi, tentang_anda, foto, cv)
        VALUES (?, ?, ?, ?, ?)`,
        [nim, prodi, about, fotoFileName, cvFileName]
      );
    } else {
      // Jika sudah ada, update
      await db.execute(
        `UPDATE pencari_kerja
        SET prodi = ?, tentang_anda = ?, foto = ?, cv = ?
        WHERE nim = ?`,
        [prodi, about, fotoFileName || rows[0].foto, cvFileName || rows[0].cv, nim]
      );
    }

    await db.end();

    return NextResponse.json({ success: true, message: "Profil berhasil disimpan!" });
  } catch (error) {
    console.error("Error saat menyimpan profil:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan profil!", error: error.message },
      { status: 500 }
    );
  }
}
