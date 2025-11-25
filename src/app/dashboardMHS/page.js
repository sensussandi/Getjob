"use client";

import { useSession } from "next-auth/react";
import { Mail, Phone } from "lucide-react";

export default function DashboardMHS() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen text-red-900">
        Memuat...
      </div>
    );
  }

  if (status === "unauthenticated") {
    window.location.href = "/loginMhs";
    return null;
  }

  const user = session.user;

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#6b0000] to-[#b22c2c] text-white p-6 text-center">
          <h1 className="text-3xl font-bold">
            Selamat Datang, {user.nama_lengkap} 👋
          </h1>
        </div>

        {/* Info */}
        <div className="flex flex-col items-center p-8 bg-gradient-to-r from-orange-200 to-gray-100">
          
          {/* FOTO PROFIL FIX */}
          <img
            src={
              user.foto
                ? `/uploads/${user.foto}`
                : "/default-avatar.jpg"
            }
            className="w-32 h-32 rounded-full border-4 border-[#6b0000] object-cover"
            alt="Foto Profil"
            onError={(e) => (e.currentTarget.src = "/default-avatar.jpg")}
          />

          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            {user.nama_lengkap}
          </h2>

          <p className="text-gray-600">{user.prodi || "Mahasiswa"}</p>

          <div className="w-full px-6 mt-4 space-y-2">
            <p className="flex items-center gap-2 text-gray-700">
              <Mail className="w-5 h-5 text-[#6b0000]" />
              {user.email}
            </p>

            <p className="flex items-center gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-[#6b0000]" />
              {user.no_telephone || "Nomor belum diisi"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
