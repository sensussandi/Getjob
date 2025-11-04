import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Login Mahasiswa",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const db = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "",
          database: "getjob_db",
        });

        // Cek apakah email dan password cocok
        const [rows] = await db.execute("SELECT * FROM pencari_kerja WHERE email = ? AND password = ?", [credentials.email, credentials.password]);

        await db.end();

        if (rows.length > 0) {
          const user = rows[0];
          // Return data yang disimpan ke session
          return {
            id: user.nim,
            nim: user.nim,
            email: user.email,
            name: user.nama_lengkap,
          };
        }

        return null; // jika gagal login
      },
    }),
  ],

  // Simpan nim ke token dan session agar bisa diakses di route lain
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.nim = user.nim;
      return token;
    },
    async session({ session, token }) {
      session.user.nim = token.nim;
      return session;
    },
  },

  pages: {
    signIn: "/loginMhs", // arahkan ke halaman login 
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
