import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { nim, password } = credentials;

        const db = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "",
          database: "getjob_db",
        });

        const [rows] = await db.query(
          "SELECT * FROM pencari_kerja WHERE nim=?",
          [nim]
        );
        await db.end();

        if (rows.length === 0) return null;

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        // 🔥 RETURN semua data user
        return {
          nim: user.nim,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          foto: user.foto,                   // NEW
          no_telephone: user.no_telephone,   // NEW
          prodi: user.prodi,                 // NEW
          tanggal_lahir: user.tanggal_lahir, // NEW
          jenis_kelamin: user.jenis_kelamin, // NEW
        };
      },
    }),
  ],

  // 🔥 CALLBACKS HARUS DITARUH DI DALAM OBJEK INI
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.nim = user.nim;
        token.nama_lengkap = user.nama_lengkap;
        token.email = user.email;
        token.foto = user.foto || null;
        token.no_telephone = user.no_telephone || null;
        token.prodi = user.prodi || null;
        token.tanggal_lahir = user.tanggal_lahir || null;
        token.jenis_kelamin = user.jenis_kelamin || null;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.nim = token.nim;
      session.user.nama_lengkap = token.nama_lengkap;
      session.user.email = token.email;

      // 🔥 tambahan data user ke session
      session.user.foto = token.foto;
      session.user.no_telephone = token.no_telephone;
      session.user.prodi = token.prodi;
      session.user.tanggal_lahir = token.tanggal_lahir;
      session.user.jenis_kelamin = token.jenis_kelamin;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
