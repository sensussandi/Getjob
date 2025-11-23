"use client";
import useAdminPerusahaanAuth from "@/hooks/useAdminPerusahaanAuth";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  MapPin,
  Plus,
  Settings,
  Eye,
  CalendarDays,
  Calendar,
  Building2,
  Mail,
  ArrowUpRight,
} from "lucide-react";

function formatTanggal(tanggal) {
  if (!tanggal) return "-";
  try {
    const date = new Date(tanggal);
    if (isNaN(date)) return tanggal;

    // Sesuaikan zona waktu WIB (+7 jam)
    const localDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    //    const perusahaanLogin = JSON.parse(localStorage.getItem("perusahaan"));
    //    if (!perusahaanLogin) {
    //      router.push("/loginPerusahaan");
    //      return;

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

export default function DashboardPerusahaan() {
  useAdminPerusahaanAuth();  // ⬅ proteksi admin Perusahaan
  const [data, setData] = useState(null);
  const router = useRouter();

  // ✅ Ambil data dari API Next.js
  useEffect(() => {
    const fetchData = async () => {
      const id = localStorage.getItem("id_admin");

//      if (!id) {
//        console.warn("Akses ditolak");
//        router.replace("/loginPerusahaan");
//        return;
//      }

      const res = await fetch(`/api/perusahaan/dashboard?id_admin=${id}`);
      const result = await res.json();

      if (result.success) {
        setData(result);
      } else {
        console.error(result.message);
      }

    };
    fetchData();
  }, []);

  // ✅ Kalau data belum siap tampil loading
  if (!data)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-[#800000] border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
        <p className="text-gray-600 text-lg font-medium mt-6">
          Memuat dashboard...
        </p>
      </div>
    );
  const handleLogout = () => {
    // hapus cookie
    document.cookie = "id_admin=; Max-Age=0; path=/; SameSite=Lax";

    // hapus localStorage
    localStorage.removeItem("id_admin");
    localStorage.removeItem("user");

    router.push("/loginPerusahaan");
  };

  // ✅ Ambil data dari hasil API
  const { admin, lowongan, pelamar, stats } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* HEADER PREMIUM */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-start">
            {/* Company Info */}
            <div className="flex items-start gap-4">
              {/* LOGO PERUSHAAN */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-lg">
                {admin && admin.logo_url ? (
                  <img
                    src={
                      admin.logo_url.startsWith("http")
                        ? admin.logo_url
                        : "/" + admin.logo_url
                    }
                    alt="Logo Perusahaan  "
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-500" />
                )}
              </div>

              {/* INFORMASI PERUSAHAAN */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {admin?.nama_perusahaan || "Perusahaan"}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {admin.alamat_perusahaan}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {admin.email || "email@company.com"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2 max-w-2xl">
                  {admin.tentang_perusahaan ||
                    "Belum ada deskripsi perusahaan."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  router.push("/dashboardPerusahaan/lowongan/tambah")
                }
                className="px-6 py-3 bg-gradient-to-r from-[#800000] to-[#b22222] text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                <span>Buat Lowongan</span>
              </button>

              <button
                onClick={() => router.push("/dashboardPerusahaan/pengaturan")}
                className="px-5 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-700"
              >
                <Settings className="w-5 h-5" />
                <span>Pengaturan</span>
              </button>
              {/* === TOMBOL LOGOUT === */}
              <button
                onClick={handleLogout}
                className="px-5 py-3 border-2 border-red-400 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center gap-2">
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATISTIK CARDS - Premium Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCardPremium
            label="Total Lowongan"
            value={stats.totalLowongan}
            icon={<Briefcase className="w-6 h-6" />}
            gradient="from-[#800000] to-[#b22222]"
          />
          <StatCardPremium
            label="Lowongan Aktif"
            value={stats.lowonganAktif}
            icon={<CheckCircle className="w-6 h-6" />}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCardPremium
            label="Total Pelamar"
            value={stats.totalPelamar}
            icon={<Users className="w-6 h-6" />}
            gradient="from-purple-500 to-purple-700"
          />
          <StatCardPremium
            label="Pelamar Baru"
            value={stats.pelamarBaru}
            icon={<TrendingUp className="w-6 h-6" />}
            gradient="from-orange-500 to-red-500"
            trendLabel="hari ini"
          />
        </div>

        {/* MAIN GRID - BALANCED LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* === LOWONGAN AKTIF (2 kolom) === */}
          <div className="lg:col-span-2 space-y-5">
            {/* Section Header */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">
                Lowongan Aktif
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Kelola dan pantau lowongan Anda
              </p>
            </div>

            {/* Job Cards */}
            <div className="space-y-5">
              {lowongan.map((job) => (
                <div
                  key={job.id_lowongan}
                  className="bg-white rounded-xl border border-gray-200 hover:border-[#800000]/30 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-[#800000] transition-colors">
                          {job.nama_posisi}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {job.lokasi}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-4 h-4" />
                            Tutup: {formatTanggal(job.tanggal_ditutup)}
                          </span>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 ml-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        {job.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                      {job.deskripsi_pekerjaan}
                    </p>

                    {/* Metrics Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {job.views}
                            </p>
                            <p className="text-xs text-gray-500">Views</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-50 p-2 rounded-lg">
                            <Users className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {job.jumlah_pelamar}
                            </p>
                            <p className="text-xs text-gray-500">Pelamar</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboardPerusahaan/lowongan/edit/${job.id_lowongan}`
                          )
                        }
                        className="px-4 py-2 bg-[#800000] text-white rounded-lg text-sm font-medium hover:bg-[#5c0000] transition-all opacity-0 group-hover:opacity-100"
                      >
                        Kelola
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* === SIDEBAR PELAMAR TERBARU (1 kolom) === */}
          <div className="space-y-5">
            {/* Header Card */}
            <div className="bg-gradient-to-r from-[#800000] to-[#b22222] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Pelamar Terbaru</h2>
              </div>
              <p className="text-white/90 text-sm">
                Kandidat yang baru melamar
              </p>
            </div>

            {/* Applicant Cards */}
            <div className="space-y-4">
              {pelamar.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#800000]/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#800000] to-[#b22222] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {p.nama_pelamar.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#800000] transition-colors truncate">
                        {p.nama_pelamar}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {p.nama_posisi}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold ${p.status === "Baru"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-[#800000] text-white"
                        }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {p.tanggal_input}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// === Premium Stat Card Component ===
function StatCardPremium({ label, value, icon, gradient, trendLabel }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
          >
            <div className="text-white">{icon}</div>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
          {trendLabel && <p className="text-xs text-gray-500">{trendLabel}</p>}
        </div>
      </div>
      <div
        className={`h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
      ></div>
    </div>
  );
}
