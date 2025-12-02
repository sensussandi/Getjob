import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

// ======== GET ========
export async function GET(req, context) {
  try {
    const { id } = await context.params;  // params harus di await

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute(
      "SELECT * FROM pencari_kerja WHERE nim = ?",
      [id]
    );

    await db.end();


    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Data tidak ditemukan"
      });
    }

    let data = rows[0];

    // 🔥 FORMAT AGAR SESUAI DENGAN <input type="date">
    data.tanggal_lahir = data.tanggal_lahir
      ? data.tanggal_lahir.toISOString().split("T")[0]   // yyyy-mm-dd
      : "";

    return NextResponse.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


// ======== PUT ========
export async function PUT(req, context) {
  try {
    const { id } = await context.params;  // params harus di await
    const body = await req.json();

    const {
      nim,
      password,
      nama_lengkap,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      email,
      no_telephone,
      prodi,
      pendidikan_terakhir,
      linkedin,
    } = body;

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // ===== Base Query (tanpa password dulu)
    let query = `
      UPDATE pencari_kerja SET 
      nim = ?,
      password = ?,
      nama_lengkap = ?,
      tanggal_lahir = ?,
      jenis_kelamin = ?,
      alamat = ?,
      email = ?,
      no_telephone = ?,
      prodi = ?,
      pendidikan_terakhir = ?,
      linkedin = ?
    `;

    let paramsUpdate = [
      nim,
      password,
      nama_lengkap,
      tanggal_lahir,
      jenis_kelamin,
      alamat,
      email,
      no_telephone,
      prodi,
      pendidikan_terakhir,
      linkedin
    ];

    // ===== Jika password diisi → hash baru
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      query += `, password = ?`;
      paramsUpdate.push(hashed);
    }

    query += ` WHERE nim = ?`;
    paramsUpdate.push(id);

    await db.execute(query, paramsUpdate);

    await db.end();

    return NextResponse.json({
      success: true,
      message: "Perusahaan berhasil diperbarui"
    });

  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Gagal update perusahaan" },
      { status: 500 }
    );
  }
}
