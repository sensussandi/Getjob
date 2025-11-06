import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

export async function POST(req) {
  try {
    // ✅ Ambil data form
    const formData = await req.formData();
    const nim = formData.get("nim"); // ✅ langsung dari form
    const photo = formData.get("photo");
    const prodi = formData.get("prodi");
    const about = formData.get("about");
    const cv = formData.get("cv");

    if (!nim) {
      return NextResponse.json({ success: false, message: "NIM tidak ditemukan!" }, { status: 400 });
    }

    // ✅ Folder upload
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

    // ✅ Koneksi database
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // ✅ Update / insert data
    const [rows] = await db.execute("SELECT nim FROM pencari_kerja WHERE nim = ?", [nim]);
    if (rows.length === 0) {
      await db.execute(
        `INSERT INTO pencari_kerja (nim, prodi, tentang_anda, foto, cv)
         VALUES (?, ?, ?, ?, ?)`,
        [nim, prodi || "", about || "", fotoFileName || "", cvFileName || ""]
      );
    } else {
      await db.execute(
        `UPDATE pencari_kerja SET prodi = ?, tentang_anda = ?, foto = ?, cv = ? WHERE nim = ?`,
        [prodi || "", about || "", fotoFileName || "", cvFileName || "", nim]
      );
    }

    await db.end();
    return NextResponse.json({ success: true, message: "Profil berhasil disimpan ke database!" });
  } catch (error) {
    console.error("❌ Error saat menyimpan profil:", error);
    return NextResponse.json({ success: false, message: "Gagal menyimpan profil!", error: error.message }, { status: 500 });
  }
}
