"use client";

import { useSession } from "next-auth/react";

export default function DashboardMHS() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Memuat...</div>;
  if (status === "unauthenticated") {
    window.location.href = "/loginMHS";
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 max-w-3xl mx-auto rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">Dashboard Mahasiswa</h1>

        <p>
          Selamat datang, <b>{session.user.nama_lengkap}</b>
        </p>

        <div className="mt-6">
          <p><b>NIM:</b> {session.user.nim}</p>
          <p><b>Email:</b> {session.user.email}</p>
        </div>
      </div>
    </div>
  );
}