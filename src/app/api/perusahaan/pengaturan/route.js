import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function connectDB() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "getjob_db",
  });
}

// === GET AMBIL PROFIL ===
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_admin = searchParams.get("id_admin");

    if (!id_admin) {
      return NextResponse.json({ success: false, message: "id_admin wajib dikirim!" });
    }

    const db = await connectDB();
    const [rows] = await db.execute(
      "SELECT id_admin, nama_perusahaan, tentang_perusahaan, alamat_perusahaan, logo_url FROM admin_perusahaan WHERE id_admin = ?",
      [id_admin]
    );
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan." });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("❌ Error ambil profil:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// === UPDATE PROFIL ===
export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id_admin = searchParams.get("id_admin");

    if (!id_admin) {
      return NextResponse.json({ success: false, message: "id_admin wajib dikirim!" });
    }

    const formData = await req.formData();
    const nama_perusahaan = formData.get("nama_perusahaan");
    const tentang_perusahaan = formData.get("tentang");
    const alamat_perusahaan = formData.get("alamat");
    const logo = formData.get("logo");

    let logoPath = null;
    if (logo && typeof logo === "object") {
      const buffer = Buffer.from(await logo.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/uploads/logo");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const fileName = `logo_${Date.now()}_${logo.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      logoPath = `/uploads/logo/${fileName}`;
    }

    const db = await connectDB();
    const [update] = await db.execute(
      `
      UPDATE admin_perusahaan 
      SET nama_perusahaan = ?, 
          tentang_perusahaan = ?, 
          alamat_perusahaan = ?,
          ${logoPath ? "logo_url = ?," : ""}
          updated_at = NOW()
      WHERE id_admin = ?
      `,
      logoPath
        ? [nama_perusahaan, tentang_perusahaan, alamat_perusahaan, logoPath, id_admin]
        : [nama_perusahaan, tentang_perusahaan, alamat_perusahaan, id_admin]
    );

    await db.end();

    return NextResponse.json({ success: true, message: "Profil diperbarui!" });

  } catch (err) {
    console.error("❌ Error update perusahaan:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
