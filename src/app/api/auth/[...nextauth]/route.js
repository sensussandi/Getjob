import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

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

        const [rows] = await db.query("SELECT * FROM pencari_kerja WHERE nim=?", [nim]);
        await db.end();

        if (rows.length === 0) return null;

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          nim: user.nim,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.nim = user.nim;
        token.nama_lengkap = user.nama_lengkap;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.nim = token.nim;
      session.user.nama_lengkap = token.nama_lengkap;
      session.user.email = token.email;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };