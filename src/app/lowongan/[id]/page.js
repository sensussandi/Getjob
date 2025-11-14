"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  DollarSign,
  CalendarDays,
  Briefcase,
  Building2,
  Clock,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

// 🗓️ Fungsi format tanggal ke Bahasa Indonesia (WIB)
function formatTanggal(tanggal) {
  if (!tanggal) return "-";
  try {
    const date = new Date(tanggal);
    if (isNaN(date)) return tanggal;

    // Konversi ke WIB (+7 jam)
    const localDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    // Format ke bahasa Indonesia
    return localDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return tanggal;
  }
}

export default function DetailLowongan() {
  const { id } = useParams();
  const router = useRouter();
  const [lowongan, setLowongan] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch detail lowongan dari API
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/lowongan/${id}`);
        const data = await res.json();
        if (data.success) setLowongan(data.data);
      } catch (err) {
        console.error("Error load detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 🌀 Loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#800000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat detail lowongan...</p>
        </div>
      </div>
    );

  // ❌ Jika data tidak ditemukan
  if (!lowongan)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium">Lowongan tidak ditemukan.</p>
        </div>
      </div>
    );

  const handleLamar = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Jika belum login → redirect
    if (!user) {
      alert("Silakan login terlebih dahulu untuk melamar.");
      router.push("/loginMhs");
      return;
    }

    try {
      const res = await fetch("/api/lamar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_lowongan: lowongan.id_lowongan,
          id_pencari_kerja: user.nim,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Lamaran berhasil dikirim!");
      } else if (data.already) {
        alert("Anda sudah melamar lowongan ini sebelumnya.");
      } else {
        alert("Gagal mengirim lamaran. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error melamar:", error);
      alert("Terjadi kesalahan saat mengirim lamaran.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 🔙 Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[#800000] hover:text-[#5c0000] font-semibold transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        {/* 🟥 Header Card */}
        <div className="bg-gradient-to-r from-[#800000] to-[#a00000] rounded-3xl p-8 mb-6 shadow-xl text-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mb-3">
                {lowongan.tipe_pekerjaan || "Full-time"}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
                {lowongan.nama_posisi}
              </h1>
              <div className="flex items-center gap-2 text-white/90 mb-4">
                <Building2 className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {lowongan.nama_perusahaan}
                </span>
              </div>
            </div>
          </div>

          {/* 🧭 Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Lokasi</span>
              </div>
              <p className="font-semibold">{lowongan.lokasi}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">Gaji</span>
              </div>
              <p className="font-semibold">{lowongan.gaji}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                <CalendarDays className="w-4 h-4" />
                <span className="font-medium">Ditutup</span>
              </div>
              <p className="font-semibold">
                {formatTanggal(lowongan.tanggal_ditutup)}
              </p>
            </div>
          </div>
        </div>

        {/* 📋 Content Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Deskripsi */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#800000]/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[#800000]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Deskripsi Pekerjaan
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {lowongan.deskripsi_pekerjaan}
            </p>
          </div>

          {/* Kualifikasi */}
          <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#800000]/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#800000]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Kualifikasi</h2>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {lowongan.kualifikasi}
            </p>
          </div>

          {/* CTA / Tombol Lamar */}
          <div className="p-8 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
            {lowongan.external_url ? (
              <a
                href={lowongan.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#800000] to-[#a00000] hover:from-[#5c0000] hover:to-[#800000] text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Lamar di Situs Perusahaan</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <button
                onClick={handleLamar}
                className="group relative w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#800000] to-[#a00000] hover:from-[#5c0000] hover:to-[#800000] text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Lamar Sekarang</span>
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
