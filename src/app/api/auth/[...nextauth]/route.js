import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Login Mahasiswa",
      credentials: {
        nim: { label: "NIM", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const db = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "",
          database: "getjob_db",
        });

        const [rows] = await db.execute(
          "SELECT * FROM pencari_kerja WHERE nim = ? AND password = ?",
          [credentials.nim, credentials.password]
        );
        await db.end();

        if (rows.length > 0) {
          const u = rows[0];
          return { id: u.nim, nim: u.nim, name: u.nama_lengkap, email: u.email };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { if (user) token.nim = user.nim; return token; },
    async session({ session, token }) { session.user.nim = token.nim; return session; },
  },
  pages: { signIn: "/loginMhs" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };