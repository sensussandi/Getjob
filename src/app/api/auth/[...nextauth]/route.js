import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function getDB() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "getjob_db",
  });
}

export const authOptions = {
  providers: [

    //  PROVIDER 1 — LOGIN MAHASISWA
    CredentialsProvider({
      id: "alumni",
      name: "Login Mahasiswa",
      credentials: {},
      async authorize(credentials) {
        const db = await getDB();
        const [rows] = await db.execute(
          "SELECT * FROM pencari_kerja WHERE nim = ?",
          [credentials.nim]
        );

        if (rows.length === 0) return null;

        const user = rows[0];
        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) return null;

        await db.end();

        return {
          id: user.nim,
          role: user.role,
          nim: user.nim,
          name: user.nama_lengkap,
          email: user.email,
          prodi: user.prodi,
          foto: user.foto,
          no_telephone: user.no_telephone,
        };
      },
    }),

    // ====================================================
    // ADMIN PERUSAHAAN
    // ====================================================
    CredentialsProvider({
      id: "admin",
      name: "Admin Perusahaan",
      credentials: {},

      async authorize(credentials) {
        const db = await getDB();
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
        const db = await getDB();
        const [rows] = await db.execute(
          "SELECT * FROM users WHERE email = ?",
          [credentials.email]
        );

        if (rows.length === 0) return null;

        const super_admin = rows[0];
        const passOK = await bcrypt.compare(credentials.password, super_admin.password);
        if (!passOK) return null;

        return {
          id: super_admin.id,
          role: super_admin.role,  // super_admin
          email: super_admin.email,
          name: super_admin.nama_admin,
        };
      }
    }),
  ],

  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 hari
    maxAge: 60 * 60, // 1 jam
  },
  jwt: {
    maxAge: 60 * 60, // 1 jam
  },


  callbacks: {
    async jwt({ token, user, account }) {

      if (account?.rememberMe === true) {
        token.maxAge = 60 * 60 * 24 * 7; // 7 hari
      } else {
        token.maxAge = 60 * 60 * 24 * 1; // 1 hari
      }

      if (user) {
        token.id = user.id;
        token.role = user.role;
        Object.assign(token, user);
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token;
      session.maxAge = token.maxAge;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
