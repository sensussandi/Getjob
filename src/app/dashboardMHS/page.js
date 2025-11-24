"use client";

import { useSession } from "next-auth/react";
import { Mail, Phone } from "lucide-react";

export default function DashboardMHS() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <div className="flex items-center justify-center h-screen text-red-900 font-semibold">
        Memuat data pengguna...
      </div>
    );

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") window.location.href = "/loginMHS";
    return null;
  }

  const user = session.user;

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Dashboard</h1>

      <div className="bg-white shadow-md rounded-xl p-6 max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Selamat datang, {user.nama_lengkap} 👋
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-red-900" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="w-5 h-5 text-red-900" />
            <span>{user.no_telephone || "Nomor belum diisi"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
