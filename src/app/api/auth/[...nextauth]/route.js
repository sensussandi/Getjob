import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [

    // ====================================================
    // ADMIN PERUSAHAAN
    // ====================================================
    CredentialsProvider({
      id: "admin",
      name: "Admin Perusahaan",
      credentials: {},

      async authorize(credentials) {
        const db = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "",
          database: "getjob_db",
        });

        const [rows] = await db.execute(
          "SELECT * FROM admin_perusahaan WHERE email_perusahaan = ?",
          [credentials.email]
        );

        if (rows.length === 0) return null;

        const admin = rows[0];
        const passOK = await bcrypt.compare(credentials.password, admin.password);
        if (!passOK) return null;

        return {
          id: admin.id_admin,
          role: admin.role,       // <-- kamu sudah punya role
          email: admin.email_perusahaan,
          nama_perusahaan: admin.nama_perusahaan,
        };
      }
    }),

    // ====================================================
    // SUPER ADMIN
    // ====================================================
    CredentialsProvider({
      id: "super_admin",
      name: "Super Admin Login",
      credentials: {},

      async authorize(credentials) {
        const db = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "",
          database: "getjob_db",
        });

        const [rows] = await db.execute(
          "SELECT * FROM users WHERE email = ? AND role = 'super_admin'",
          [credentials.email]
        );

        if (rows.length === 0) return null;

        const user = rows[0];
        const passOK = await bcrypt.compare(credentials.password, user.password);
        if (!passOK) return null;

        return {
          id: user.id,
          role: user.role,  // super_admin
          email: user.email,
          name: user.nama_admin,
        };
      }
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        Object.assign(token, user);
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
