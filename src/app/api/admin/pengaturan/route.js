import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");   // SUPER ADMIN pakai "id"

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "ID super_admin tidak ditemukan",
      });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    const [rows] = await db.execute(
      "SELECT email FROM users WHERE id = ? LIMIT 1",
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
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
// POST - Update data admin
export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "ID super_admin tidak ditemukan",
      });
    }

    const form = await req.formData();
    const email = form.get("email");
    const password = form.get("password");

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    let query = "UPDATE users SET email = ?";
    let params = [email];

    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      query += ", password = ?";
      params.push(hashed);
    }

    query += " WHERE id = ?";
    params.push(id);

    await db.execute(query, params);
    await db.end();

    return NextResponse.json({
      success: true,
      message: "Akun super_admin berhasil diperbarui",
    });

  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
