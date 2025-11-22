import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export const authOptions = {
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

          if (!nim || !password) return null;

          db = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "getjob_db",
          });

          const [rows] = await db.execute(
            "SELECT * FROM pencari_kerja WHERE nim = ?",
            [nim]
          );

          if (rows.length === 0) return null;

          const user = rows[0];

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;

          return {
            id: user.nim,
            nim: user.nim,
            name: user.nama_lengkap,
            email: user.email,
            prodi: user.prodi,
            foto: user.foto,
            no_telephone: user.no_telephone,
          };
        } finally {
          if (db) await db.end();
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
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
      session.user.foto = token.foto
        ? `/uploads/${token.foto}`
        : "/default-avatar.png";

      return session;
    },
  },

  pages: {
    signIn: "/loginMhs",
  },
};
