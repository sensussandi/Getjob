import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

// GET: Ambil data profil berdasarkan NIM
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const nim = searchParams.get("nim");

  if (!nim) {
    return NextResponse.json({ success: false, message: "NIM tidak ditemukan!" }, { status: 400 });
  }

  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute("SELECT * FROM pencari_kerja WHERE nim = ?", [nim]);
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Data profil tidak ditemukan." });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error GET profil:", error);
    return NextResponse.json({ success: false, message: "Gagal memuat profil!", error: error.message }, { status: 500 });
  }
}

// POST: Simpan atau update data profil
export async function POST(req) {
  try {
    const formData = await req.formData();
    const nim = formData.get("nim");
    const photo = formData.get("photo");
    const prodi = formData.get("prodi");
    const about = formData.get("about");
    const cv = formData.get("cv");

    if (!nim) {
      return NextResponse.json({ success: false, message: "NIM tidak ditemukan!" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file, name) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(path.join(uploadDir, name), buffer);
    };

    let fotoFileName = null;
    let cvFileName = null;

    if (photo && typeof photo.name === "string") {
      fotoFileName = `${Date.now()}_${photo.name}`;
      await saveFile(photo, fotoFileName);
    }
    if (cv && typeof cv.name === "string") {
      cvFileName = `${Date.now()}_${cv.name}`;
      await saveFile(cv, cvFileName);
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute("SELECT nim FROM pencari_kerja WHERE nim = ?", [nim]);
    if (rows.length === 0) {
      await db.execute(
        `INSERT INTO pencari_kerja (nim, prodi, tentang_anda, foto, cv)
        VALUES (?, ?, ?, ?, ?)`,
        [nim, prodi || "", about || "", fotoFileName || "", cvFileName || ""]
      );
    } else {
      await db.execute(
        `UPDATE pencari_kerja 
        SET prodi = ?, tentang_anda = ?, foto = COALESCE(?, foto), cv = COALESCE(?, cv)
        WHERE nim = ?`,
        [prodi || "", about || "", fotoFileName, cvFileName, nim]
      );
    }

    await db.end();
    return NextResponse.json({ success: true, message: "Profil berhasil disimpan ke database!" });
  } catch (error) {
    console.error("Error saat menyimpan profil:", error);
    return NextResponse.json({ success: false, message: "Gagal menyimpan profil!", error: error.message }, { status: 500 });
  }
}
