import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs"; // ✅ Tambahan baru untuk hashing

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

        // 🔹 Ubah query: cukup ambil berdasarkan NIM saja (tidak perlu cek password langsung)
        const [rows] = await db.execute(
          "SELECT * FROM pencari_kerja WHERE nim = ?",
          [credentials.nim]
        );

        await db.end();

        if (rows.length === 0) {
          console.log("❌ NIM tidak ditemukan");
          return null;
        }

        const u = rows[0];
        let isPasswordValid = false;

        // ✅ Tambahan baru: cek apakah password sudah di-hash
        if (u.password.startsWith("$2a$") || u.password.startsWith("$2b$")) {
          isPasswordValid = await bcrypt.compare(credentials.password, u.password);
        } else {
          // Untuk data lama (plaintext)
          isPasswordValid = credentials.password === u.password;
        }

        if (!isPasswordValid) {
          console.log("❌ Password salah");
          return null;
        }

        // ✅ Tambahan opsional: rehash password lama yang masih plaintext
        if (!u.password.startsWith("$2a$") && !u.password.startsWith("$2b$")) {
          try {
            const hashed = await bcrypt.hash(credentials.password, 10);
            const db2 = await mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "",
              database: "getjob_db",
            });
            await db2.execute("UPDATE pencari_kerja SET password = ? WHERE nim = ?", [hashed, credentials.nim]);
            await db2.end();
            console.log("🔄 Password lama di-hash ulang secara otomatis");
          } catch (err) {
            console.error("⚠️ Gagal rehash password lama:", err);
          }
        }

        // ✅ Kembalikan data user ke session NextAuth
        return { id: u.nim, nim: u.nim, name: u.nama_lengkap, email: u.email };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // default 7 hari
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  },

  callbacks: {
    // 🔹 Tetap sama seperti kode lamamu
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.nim = user.nim;
        token.name = user.name;
        token.email = user.email;
      }

      if (trigger === "update" && session?.rememberMe !== undefined) {
        token.rememberMe = session.rememberMe;
        token.maxAge = session.rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 4;
      }

      return token;
    },

    async session({ session, token }) {
      if (!session.user) session.user = {};
      session.user.nim = token.nim;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.rememberMe = token.rememberMe || false;
      return session;
    },
  },

  pages: {
    signIn: "/loginMhs",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
