import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { getSessionUser } from "@/lib/getSessionUser";

export async function POST(req) {
  try {
    // ✅ Ambil session user (nim dari login)
    const user = await getSessionUser();
    const nim = user.nim;

    // ✅ Ambil data form
    const formData = await req.formData();
    const photo = formData.get("photo");
    const prodi = formData.get("prodi");
    const about = formData.get("about");
    const cv = formData.get("cv");

    // ✅ Siapkan folder upload
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file, name) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(path.join(uploadDir, name), buffer);
    };

    let fotoFileName = null;
    let cvFileName = null;

    if (photo && photo.name) {
      fotoFileName = `${Date.now()}_${photo.name}`;
      await saveFile(photo, fotoFileName);
    }

    if (cv && cv.name) {
      cvFileName = `${Date.now()}_${cv.name}`;
      await saveFile(cv, cvFileName);
    }

    // ✅ Koneksi ke MySQL
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // ✅ Pastikan user sudah ada
    const [rows] = await db.execute("SELECT nim FROM pencari_kerja WHERE nim = ?", [nim]);

    if (rows.length === 0) {
      // 🔹 Jika belum ada, tambahkan baris baru
      await db.execute(
        `INSERT INTO pencari_kerja (nim, prodi, tentang_anda, foto, cv)
         VALUES (?, ?, ?, ?, ?)`,
        [nim, prodi || "", about || "", fotoFileName || "", cvFileName || ""]
      );
    } else {
      // 🔹 Jika sudah ada, update data-nya
      const query = `
        UPDATE pencari_kerja
        SET prodi = ?, tentang_anda = ?, foto = ?, cv = ?
        WHERE nim = ?`;
      const values = [prodi || rows[0].prodi, about || rows[0].tentang_anda, fotoFileName || rows[0].foto, cvFileName || rows[0].cv, nim];
      await db.execute(query, values);
    }

    await db.end();

    return NextResponse.json({ success: true, message: "✅ Profil berhasil disimpan ke database!" });
  } catch (error) {
    console.error("❌ Error saat menyimpan profil:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan profil!", error: error.message },
      { status: 500 }
    );
  }
}
