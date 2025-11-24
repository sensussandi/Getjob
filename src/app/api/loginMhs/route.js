import mysql from "mysql2/promise";
import bycrypt from "bcryptjs";

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
      let validPassword = false;

      // Jika password sudah di-hash (diawali $2a$ atau $2b$)
      if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
        validPassword = await bcrypt.compare(password, user.password);
      } else {
        // 🔹 Jika masih plaintext (data lama), bandingkan biasa
        validPassword = password === user.password;
      }

      if (!validPassword) {
        await connection.end();
        return NextResponse.json(
          { success: false, message: "Password salah!" },
          { status: 401 }
        );
      }

      let redirect = "/";
      let role = user.role;

      if (tableType === "pencari_kerja" && role === "alumni") {
        redirect = "/dashboardMHS";
      } else {
        return NextResponse.json(
          { success: false, message: "Akses ditolak. Role tidak diizinkan." },
          { status: 403 }
        );
      }


      // Simpan waktu login terakhir ke kolom linkedin sebagai contoh
      await connection.execute("UPDATE pencari_kerja SET linkedin = ? WHERE nim = ?", [`Terakhir login: ${new Date().toISOString()}`, nim]);

      await connection.end();

      return Response.json({
        success: true,
        message: "Login berhasil!",
        redirect,
        role,
        data: {
          nim: user.nim,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          no_telephone: user.no_telephone,
          password: user.password,
          prodi: user.prodi,
          role,
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
