"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Mail, Phone } from "lucide-react";

export default function DashboardMHS() {
  const { data: session, status } = useSession();
  const [localUser, setLocalUser] = useState(null);

  if (status === "loading") {
    return <div>Memuat data...</div>;
  }

  if (!session?.user?.nim) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">Anda belum login.</p>
        <a href="/loginMhs" className="bg-red-900 text-white px-4 py-2 rounded-lg">Ke Halaman Login</a>
      </div>
    );
  }

  const user = session.user;


  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-red-900 font-semibold">
        Memuat data pengguna...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">Anda belum login.</p>
        <a
          href="/loginMhs"
          className="bg-red-900 text-white px-4 py-2 rounded-lg hover:bg-red-800"
        >
          Ke Halaman Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f8] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#6b0000] to-[#b22c2c] text-white p-6 text-center">
          <h1 className="text-3xl font-bold">
            Selamat Datang, {user.name || user.nama_lengkap} 👋
          </h1>
        </div>

        <div className="flex flex-col items-center p-8 bg-gradient-to-r from-orange-200 to-gray-100">
          <img
            src={session?.user?.foto || "/default-avatar.png"}
            alt="Foto Profil"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#6b0000]"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            {user.name || "Mahasiswa"}
          </h2>
          <p className="text-gray-600">
            {user.prodi || "Program Studi Tidak Diketahui"}
          </p>

          <div className="mt-4 text-left w-full px-6 space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-5 h-5 text-[#6b0000]" />
              <span>{user.email || "Email belum diisi"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-[#6b0000]" />
              <span>{user.no_telephone || "Nomor belum diisi"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}