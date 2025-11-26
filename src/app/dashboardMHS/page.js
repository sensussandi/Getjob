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

  // ⬅ fetch data setelah session siap
  useEffect(() => {
    if (!session || session.user.role !== "alumni") return;
    const fetchData = async () => {
      const res = await fetch(`/api/pencari_kerja?nim=${session.user.id}`);
      
      const result = await res.json();

      if (result.success) {
        setData(result);  
      }
    };

    fetchData();
  }, [session]);

  const user = session?.user;

  return (
    <div className="min-h-screen bg-[#fff8f8] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#6b0000] to-[#b22c2c] text-white p-6 text-center">
          <h1 className="text-3xl font-bold">
            Selamat Datang, {user?.name || user?.nama_lengkap} 👋
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
            {user?.name || "Mahasiswa"}
          </h2>
          <p className="text-gray-600">
            {user?.prodi || "Program Studi Tidak Diketahui"}
          </p>

          <div className="mt-4 text-left w-full px-6 space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-5 h-5 text-[#6b0000]" />
              <span>{user?.email || "Email belum diisi"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-5 h-5 text-[#6b0000]" />
              <span>{user?.no_telephone || "Nomor belum diisi"}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}