"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  MapPin,
} from "lucide-react";

export default function DashboardPerusahaan() {
  const [data, setData] = useState(null);
  const router = useRouter();

  // ✅ Ambil data dari API Next.js (bukan dummy)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/perusahaan/dashboard");
        const result = await res.json();
        if (result.success) {
          setData(result);
        } else {
          console.error("Gagal ambil data dashboard");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Kalau data belum siap tampil loading
  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg font-medium">Memuat dashboard...</p>
      </div>
    );

  // ✅ Ambil data dari hasil API
  const { admin, lowongan, pelamar, stats } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER PERUSAHAAN */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
             {admin.nama_perusahaan}
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {admin.alamat_perusahaan}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 text-white rounded-lg font-medium transition"
              style={{ backgroundColor: "#800000" }}
            >
              + Buat Lowongan Baru
            </button>
            <button
              className="px-4 py-2 border-2 rounded-lg font-medium transition"
              style={{ borderColor: "#800000", color: "#800000" }}
            >
              Edit Profil
            </button>
          </div>
        </div>
      </div>

      {/* STATISTIK */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Lowongan"
          value={stats.totalLowongan}
          icon={<Briefcase />}
          color="#800000"
        />
        <StatCard
          label="Lowongan Aktif"
          value={stats.lowonganAktif}
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          label="Total Pelamar"
          value={stats.totalPelamar}
          icon={<Users />}
          color="purple"
        />
        <StatCard
          label="Pelamar Baru"
          value={stats.pelamarBaru}
          icon={<TrendingUp />}
          color="orange"
        />
      </div>

      {/* LOWONGAN DAN PELAMAR TERBARU */}
      <div className="max-w-7xl mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* === LOWONGAN AKTIF === */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Lowongan Aktif
          </h2>
          <div className="space-y-4">
            {lowongan.map((job) => (
              <div
                key={job.id_lowongan}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {job.nama_posisi}
                    </h3>
                    <p className="text-sm text-gray-600 flex gap-2 items-center">
                      <MapPin className="w-4 h-4" /> {job.lokasi}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  {job.deskripsi_pekerjaan}
                </p>
                <div className="text-xs text-gray-500 flex gap-4">
                  <span>{job.views} views</span>
                  <span>{job.jumlah_pelamar} pelamar</span>
                  <span>Tutup: {job.tanggal_ditutup}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === PELAMAR TERBARU === */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Pelamar Terbaru
          </h2>
          <div className="space-y-3">
            {pelamar.map((p) => (
              <div
                key={p.id}
                className="border-l-4 pl-4 py-2 border-[#800000] hover:bg-gray-50"
              >
                <h4 className="font-medium text-gray-900">{p.nama_pelamar}</h4>
                <p className="text-sm text-gray-600">{p.nama_posisi}</p>
                <div className="flex justify-between items-center mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      p.status === "Baru"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-[#800000] text-white"
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {p.tanggal_input}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// === Komponen Kecil untuk Kartu Statistik ===
function StatCard({ label, value, icon, color }) {
  const colorMap = {
    "#800000": "bg-[#fff5f5] text-[#800000]",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`p-3 rounded-full ${
            colorMap[color] || "bg-gray-100 text-gray-700"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
