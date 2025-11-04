import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// === Koneksi Database ===
async function connectDB() {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // isi kalau MySQL kamu pakai password
    database: "getjob_db",
  });
}

// === API POST: Update data perusahaan ===
export async function POST(req) {
  try {
    const formData = await req.formData();

    const nama_perusahaan = formData.get("nama_perusahaan");
    const tentang_perusahaan = formData.get("tentang");
    const alamat_perusahaan = formData.get("alamat");
    const logo = formData.get("logo");

    // Validasi data wajib
    if (!nama_perusahaan || !alamat_perusahaan) {
      return NextResponse.json(
        { success: false, message: "Nama perusahaan dan alamat wajib diisi." },
        { status: 400 }
      );
    }

    // Upload logo (jika ada)
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

    // Update ke database (sementara id_admin = 1)
    const db = await connectDB();
    const id_admin = 1; // nanti bisa disesuaikan dengan session login

    const [result] = await db.execute(
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

    return NextResponse.json({
      success: true,
      message: "Data perusahaan berhasil diperbarui.",
      updated: result.affectedRows,
    });
  } catch (err) {
    console.error("❌ Error update perusahaan:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server.", error: err.message },
      { status: 500 }
    );
  }
}

// === API GET: Ambil data perusahaan ===
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      "SELECT id_admin, nama_perusahaan, tentang_perusahaan, alamat_perusahaan, logo_url FROM admin_perusahaan WHERE id_admin = 1"
    );
    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan." });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("❌ Error ambil profil:", err);
    return NextResponse.json(
      { success: false, message: "Gagal memuat profil perusahaan.", error: err.message },
      { status: 500 }
    );
  }
}
