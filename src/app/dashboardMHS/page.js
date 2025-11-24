"use client";

import { useSession, signOut } from "next-auth/react";
import { Mail, Phone } from "lucide-react";

export default function DashboardMHS() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-red-900 font-semibold">
        Memuat data pengguna...
      </div>
    );
  }

  if (status === "unauthenticated") {
    window.location.href = "/loginMHS";
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">
        <h1 className="text-3xl font-bold mb-6 text-red-900">
          Dashboard Mahasiswa
        </h1>

        <div className="space-y-4 text-gray-700">
          <p>
            <b>Nama Lengkap:</b> {user.nama_lengkap}
          </p>
          <p>
            <b>NIM:</b> {user.nim}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="w-5 h-5" /> {user.email}
          </p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/loginMHS" })}
          className="mt-8 w-full bg-red-900 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}