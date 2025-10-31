import mysql from "mysql2/promise";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nim, password } = body;

    if (!nim || !password) {
      return Response.json(
        { success: false, message: "NIM dan Password wajib diisi!" },
        { status: 400 }
      );
    }

    // 🔧 Koneksi ke database lokal (pastikan XAMPP MySQL aktif)
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // 🔍 Cek user di database
    const [rows] = await connection.execute(
      "SELECT * FROM pencari_kerja WHERE nim = ? AND password = ?",
      [nim, password]
    );

    if (rows.length === 0) {
      await connection.end();
      return Response.json(
        { success: false, message: "NIM atau Password salah!" },
        { status: 401 }
      );
    }

    const user = rows[0];
    await connection.end();

    // ✅ Balas JSON dengan data user
    return Response.json({
      success: true,
      message: "Login berhasil!",
      data: {
        nim: user.nim,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        no_telephone: user.no_telephone,
        prodi: user.prodi,
      },
    });
  } catch (error) {
    console.error("Error di loginMhs:", error.message);
    return Response.json(
      { success: false, message: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
