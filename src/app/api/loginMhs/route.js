import mysql from "mysql2/promise";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nim, password } = body;

    if (!nim || !password) {
      return Response.json({ success: false, message: "NIM dan Password wajib diisi!!" }, { status: 400 });
    }

    // Koneksi ke Database
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "getjob_db",
    });

    // Cek apakah user dengan NIM dan password cocok
    const [rows] = await connection.execute("SELECT * FROM pencari_kerja WHERE nim = ? AND password = ?", [nim, password]);

    if (rows.length > 0) {
      // Jika login berhasil, simpan waktu login ke tabel log (opsional)
      const user = rows[0];
      // Misalnya kamu mau update status atau waktu login terakhir:
      await connection.execute("UPDATE pencari_kerja SET linkedin = ? WHERE nim = ?", [`Terakhir login: ${new Date().toISOString()}`, nim]);

      await connection.end();

      return Response.json({
        success: true,
        message: "Login berhasil!",
        data: {
          nim: user.nim,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          no_telephone: user.no_telephone,
          password: user.password,
          prodi: user.prodi,
        },
      });
    } else {
      await connection.end();
      return Response.json({ success: false, message: "NIM atau Password salah!" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error loginMhs:", error.message);
    return Response.json({ success: false, message: "Server error: " + error.message }, { status: 500 });
  }
}
