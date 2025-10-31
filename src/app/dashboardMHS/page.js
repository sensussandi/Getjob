"use client";
import { useEffect, useState } from "react";

export default function DashboardMHS() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-red-900 font-semibold">
        Memuat data pengguna...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-50 p-8">
      <h1 className="text-3xl font-bold text-red-900 mb-4">
        Selamat Datang, {user?.nama_lengkap || "Mahasiswa"} 👋
      </h1>
      <p className="text-lg text-gray-700">NIM: {user?.nim}</p>
      <p className="text-lg text-gray-700">Program Studi: {user?.prodi}</p>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.href = "/loginMhs";
        }}
        className="mt-6 bg-red-900 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
      >
        Logout
      </button>
  </div>
);
}