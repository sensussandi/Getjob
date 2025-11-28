import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

// =====================
// ======== GET ========
// =====================
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
      "SELECT * FROM admin_perusahaan WHERE id_admin = ?",
      [id]
    );

    await db.end();

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Data tidak ditemukan",
      });
    }

    return NextResponse.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


// =====================
// ======== PUT ========
// =====================
export async function PUT(req, context) {
  try {
    const { id } = await context.params;  // params harus di await
    const body = await req.json();

    const {
      nama_perusahaan,
      email_perusahaan,
      password,
      no_telepone,
      logo_url,
      alamat_perusahaan,
      tentang_perusahaan,
    } = body;

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    let query = `
      UPDATE admin_perusahaan SET 
      nama_perusahaan = ?,
      email_perusahaan = ?,
      no_telepone = ?,
      logo_url = ?,
      alamat_perusahaan = ?,
      tentang_perusahaan = ?
    `;

    let paramsUpdate = [
      nama_perusahaan,
      email_perusahaan,
      no_telepone,
      logo_url,
      alamat_perusahaan,
      tentang_perusahaan,
    ];

    // jika password diisi → hash & update
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      query += `, password = ?`;
      paramsUpdate.push(hashed);
    }

    query += ` WHERE id_admin = ?`;
    paramsUpdate.push(id);

    await db.execute(query, paramsUpdate);
    await db.end();

    return NextResponse.json({
      success: true,
      message: "Perusahaan berhasil diperbarui",
    });

  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Gagal update perusahaan" },
      { status: 500 }
    );
  }
}
