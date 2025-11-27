"use client";
import usePencakerAuth from "@/hooks/usePencakerAuth";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardMHS() {
  usePencakerAuth();
  const [data, setData] = useState(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session || session.user.role !== "alumni") return;

    const fetchData = async () => {
      const res = await fetch(`/api/pencari_kerja?nim=${session.user.id}`);
      const result = await res.json();
      if (result.success) setData(result);
    };

    fetchData();
  }, [session]);

  const user = session?.user;

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4">

      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl overflow-hidden">

        <div className="bg-gradient-to-r from-[#6b0000] to-[#b22c2c] text-white p-6 text-center">
          <h1 className="text-3xl font-bold">
            Selamat Datang, {user?.nama_lengkap || user?.name} 👋
          </h1>
        </div>

        <div className="flex flex-col items-center p-8 bg-gradient-to-r from-orange-200 to-gray-100">

          <img
            src={
              user?.foto
                ? (user.foto.startsWith("/uploads/")
                    ? user.foto
                    : `/uploads/${user.foto}`)
                : "/default-avatar.jpg"
            }
            className="w-32 h-32 rounded-full border-4 border-[#6b0000] object-cover"
            alt="Foto Profil"
            onError={(e) => (e.currentTarget.src = "/default-avatar.jpg")}
          />

          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            {user?.nama_lengkap || user?.name}
          </h2>

          <p className="text-gray-600">{user?.prodi || "Mahasiswa"}</p>

          <div className="w-full px-6 mt-4 space-y-2">
            <p className="flex items-center gap-2 text-gray-700">
              <Mail className="w-5 h-5 text-[#6b0000]" />
              <span>{user?.email || "Email belum diisi"}</span>
            </p>

            <p className="flex items-center gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-[#6b0000]" />
              <span>{user?.no_telephone || "Nomor belum diisi"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}