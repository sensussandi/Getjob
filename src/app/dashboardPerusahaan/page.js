"use client";
import useAdminPerusahaanAuth from "@/hooks/useAdminPerusahaanAuth";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
  MapPin,
  Plus,
  Settings,
  Eye,
  CalendarDays,
  Building2,
  Mail,
  ArrowRight,
  Search,
  Filter,
} from "lucide-react";

function formatTanggal(tanggal) {
  if (!tanggal) return "-";
  try {
    const date = new Date(tanggal);
    if (isNaN(date)) return tanggal;

    const localDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

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
  useAdminPerusahaanAuth();
  const [data, setData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();

  // === SEARCH & FILTER LOWONGAN ===
  const [searchLowongan, setSearchLowongan] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("semua");

  useEffect(() => {
    if (!session || session.user.role !== "admin") return;

    const fetchData = async () => {
      const res = await fetch(
        `/api/perusahaan/dashboard?id_admin=${session.user.id}`
      );

      const result = await res.json();

      if (result.success) {
        setData(result);
      } else {
        console.error(result.message);
      }
    };

    fetchData();
  }, [session]);

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
    signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  const { admin, lowongan, pelamar, stats } = data;

  // === FILTER & SEARCH LOWONGAN ===
  const filteredLowongan = lowongan.filter((job) => {
    const q = searchLowongan.toLowerCase();

    const matchSearch =
      job.nama_posisi.toLowerCase().includes(q) ||
      job.deskripsi_pekerjaan.toLowerCase().includes(q);

    const matchLokasi =
      filterLokasi === "semua" ? true : job.lokasi === filterLokasi;

    return matchSearch && matchLokasi;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* HEADER PREMIUM */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-start">
            {/* Company Info */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-lg">
                {admin && admin.logo_url ? (
                  <img
                    src={
                      admin.logo_url.startsWith("http")
                        ? admin.logo_url
                        : "/" + admin.logo_url
                    }
                    alt="Logo Perusahaan"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-500" />
                )}
              </div>

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

              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-5 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
              >
                <span>Logout</span>
              </button>

              {showLogoutModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-xl shadow-lg w-[340px]">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">
                      Konfirmasi Logout
                    </h3>
                    <p className="text-gray-600 mb-5">
                      Apakah Anda yakin ingin logout dari akun ini?
                    </p>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowLogoutModal(false)}
                        className="px-4 py-2 text-black rounded-lg border border-gray-300 hover:bg-red-100"
                      >
                        Batal
                      </button>

                      <button
                        onClick={() => {
                          setShowLogoutModal(false);
                          handleLogout();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Ya, Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
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

            {/* SEARCH & FILTER LOWONGAN - DIPINDAHKAN KE SINI */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                {/* SEARCH INPUT */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari posisi atau deskripsi..."
                    value={searchLowongan}
                    onChange={(e) => setSearchLowongan(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>

                {/* FILTER LOKASI */}
                <div className="relative md:w-56">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterLokasi}
                    onChange={(e) => setFilterLokasi(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent outline-none appearance-none cursor-pointer transition-all duration-200"
                  >
                    <option value="semua">Semua Lokasi</option>
                    {[...new Set(lowongan.map((l) => l.lokasi))].map((lok) => (
                      <option key={lok} value={lok}>
                        {lok}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result Count */}
              <div className="mt-3 text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-[#800000]">{filteredLowongan.length}</span> dari {lowongan.length} lowongan
              </div>
            </div>

            {/* Job Cards */}
            <div className="space-y-5">
              {filteredLowongan.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tidak ada lowongan ditemukan
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Coba ubah kata kunci pencarian atau filter lokasi
                  </p>
                </div>
              ) : (
                filteredLowongan.map((job) => (
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
                ))
              )}
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
              {pelamar
                .sort(
                  (a, b) =>
                    new Date(b.tanggal_input) - new Date(a.tanggal_input)
                )
                .slice(0, 3)
                .map((p) => (
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
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
                          p.status === "Baru"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-[#800000] text-white"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Tombol Lihat Semua Pelamar */}
            <div className="text-center mt-6">
              <button
                onClick={() =>
                  router.push("/dashboardPerusahaan/semuaPelamar")
                }
                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#800000] to-[#a00000] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Users className="w-5 h-5" />
                Lihat Semua Kandidat
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
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