import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Login Mahasiswa",
      credentials: {
        nim: { label: "NIM", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        let db;
        try {
          const nim = credentials.nim?.trim();
          const password = credentials.password?.trim();

          if (!nim || !password) {
            console.error("NIM atau Password kosong!");
            return null;
          }

          // Koneksi ke database
          db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "getjob_db",
          });

          const [rows] = await db.execute("SELECT * FROM pencari_kerja WHERE nim = ?", [nim]);
          if (rows.length === 0) {
            console.error("User tidak ditemukan:", nim);
            return null;
          }

          const user = rows[0];

          // Validasi password (bcrypt)
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            console.error("Password salah untuk NIM:", nim);
            return null;
          }

          console.log("Login berhasil:", user.nama_lengkap);

          return {
            id: user.nim,
            nim: user.nim,
            name: user.nama_lengkap,
            email: user.email,
            prodi: user.prodi,
            foto: user.foto,
            no_telephone: user.no_telephone,
          };
        } catch (err) {
          console.error("Authorize Error:", err);
          return null;
        } finally {
          if (db) await db.end();
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.nim = user.nim;
        token.name = user.name;
        token.email = user.email;
        token.prodi = user.prodi;
        token.foto = user.foto;
        token.no_telephone = user.no_telephone;
      }
      return token;
    },

    async session({ session, token }) {
  session.user.nim = token.nim;
  session.user.name = token.name;
  session.user.email = token.email;
  session.user.prodi = token.prodi;
  session.user.no_telephone = token.no_telephone;

  // Cegah path double
  session.user.foto = token.foto?.startsWith("/uploads/")
    ? token.foto
    : token.foto
    ? `/uploads/${token.foto}`
    : "/default-avatar.png";

  return session;
},
  },

  pages: {
    signIn: "/loginMhs",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };