// app/api/admin/reset-password/route.js
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

function toDDMMYYYY(input) {
  if (!input) throw new Error("tanggal_lahir kosong");

  // 1) Jika Date object
  if (input instanceof Date && !isNaN(input)) {
    const d = String(input.getUTCDate()).padStart(2, "0");
    const m = String(input.getUTCMonth() + 1).padStart(2, "0");
    const y = String(input.getUTCFullYear());
    return `${d}${m}${y}`;
  }

  const s = String(input).trim();

  // 2) ISO dengan waktu: 2005-01-01T...
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})[T\s]/);
  if (m) return `${m[3].padStart(2,"0")}${m[2].padStart(2,"0")}${m[1]}`;

  // 3) YYYY-MM-DD atau YYYY/MM/DD
  m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (m) return `${m[3].padStart(2,"0")}${m[2].padStart(2,"0")}${m[1]}`;

  // 4) DD-MM-YYYY atau DD/MM/YYYY
  m = s.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
  if (m) return `${m[1].padStart(2,"0")}${m[2].padStart(2,"0")}${m[3]}`;

  // 5) Fallback: biarkan JS parse
  const dObj = new Date(s);
  if (!isNaN(dObj)) {
    const d = String(dObj.getUTCDate()).padStart(2, "0");
    const mo = String(dObj.getUTCMonth() + 1).padStart(2, "0");
    const y = String(dObj.getUTCFullYear());
    return `${d}${mo}${y}`;
  }

  throw new Error(`Format tanggal_lahir tidak dikenali: "${s}"`);
}

export async function POST(req) {
  try {
    const { nim } = await req.json();
    if (!nim) {
      return NextResponse.json({ success:false, message:"nim wajib dikirim" }, { status:400 });
    }

    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // OPSIONAL tapi disarankan: paksa MySQL kirim string YYYY-MM-DD
    const [rows] = await db.execute(
      "SELECT DATE_FORMAT(tanggal_lahir, '%Y-%m-%d') AS tgl FROM pencari_kerja WHERE nim = ? LIMIT 1",
      [nim]
    );

    if (!rows?.length) {
      await db.end();
      return NextResponse.json({ success:false, message:"User tidak ditemukan" }, { status:404 });
    }

    const tgl = rows[0].tgl; // sudah 'YYYY-MM-DD' karena DATE_FORMAT
    const newPassPlain = toDDMMYYYY(tgl); // "DDMMYYYY"
    const newPassHash = await bcrypt.hash(newPassPlain, 10);

    await db.execute(
      "UPDATE pencari_kerja SET password = ?, reset_request = 0 WHERE nim = ?",
      [newPassHash, nim]
    );

    await db.end();

    return NextResponse.json({
      success: true,
      newPass: newPassPlain, // ditampilkan ke admin via alert
      message: "Password direset berdasarkan tanggal lahir (DDMMYYYY).",
    });
  } catch (err) {
    console.error("❌ reset-password error:", err);
    return NextResponse.json({ success:false, message: err.message }, { status:500 });
  }
}