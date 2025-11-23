"use client";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Briefcase,
  BarChart3,
  Plus,
  Eye,
  Trash2,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Info,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";


export default function DashboardAdmin() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPerusahaan: 0,
    totalPencariKerja: 0,
    totalLowongan: 0,
  });

  const [dataPerusahaan, setDataPerusahaan] = useState([]);
  const [dataPencariKerja, setDataPencariKerja] = useState([]);
  const [dataLowongan, setDataLowongan] = useState([]);

  // Ambil data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perusahaanRes, pencakerRes, lowonganRes, pelamar, stats] = await Promise.all([
          fetch("/api/admin/perusahaan").then((r) => r.json()),
          fetch("/api/admin/pencaker").then((r) => r.json()),
          fetch("/api/perusahaan/dashboard").then((r) => r.json()),
        ]);

        const perusahaan = perusahaanRes.data || [];
        const pencaker = pencakerRes.data || [];
        const lowongan = lowonganRes.data || [];



        setDataPerusahaan(perusahaan);
        setDataPencariKerja(pencaker);
        setDataLowongan(lowongan);
        setStats({
          totalPerusahaan: perusahaan.length,
          totalPencariKerja: pencaker.length,
          totalLowongan: lowongan.length,
        });
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    // Hapus cookie
    document.cookie = "id_admin=; Max-Age=0; path=/; SameSite=Lax";

    // Hapus localStorage
    localStorage.removeItem("id");
    localStorage.removeItem("user");
    router.push("/loginPerusahaan");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#800000] to-[#b22222] text-white p-8 rounded-2xl shadow-lg mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-white/80 mt-2">Pantau seluruh aktivitas sistem GetJob</p>
          </div>
          <div className="bg-white/20 px-5 py-2 rounded-xl text-sm backdrop-blur-sm">
            <BarChart3 className="inline w-5 h-5 mr-2" /> Statistik Sistem
          </div>
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Building2 />} title="Total Perusahaan" value={stats.totalPerusahaan} color="from-blue-500 to-blue-600" />
          <StatCard icon={<Users />} title="Total Pencari Kerja" value={stats.totalPencariKerja} color="from-green-500 to-green-600" />
          <StatCard icon={<Briefcase />} title="Total Lowongan Aktif" value={stats.totalLowongan} color="from-yellow-500 to-yellow-600" />
        </div>

        {/* === DATA PERUSAHAAN === */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-10">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800">Data Perusahaan</h3>
            <button
              onClick={() => router.push("/dashboardAdmin/perusahaan/tambah")}
              className="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#a00000] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {/* GRID CARD PERUSAHAAN */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataPerusahaan.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-6">Tidak ada data perusahaan</p>
            ) : (
              dataPerusahaan.map((p, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl hover:border-[#800000]/40 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#800000] transition-colors">
                          {p.nama_perusahaan}
                        </h4>
                        <p className="text-sm text-gray-500">{p.nama_admin}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                        {p.role || "admin"}
                      </span>
                    </div>

                    {/* Logo perusahaan */}
                    {p.logo_url && (
                      <img
                        src={`/uploads/${p.logo_url}`}
                        alt="logo perusahaan"
                        className="w-full h-32 object-contain rounded-md mb-3 border"
                      />
                    )}

                    {/* Detail */}
                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {p.email_perusahaan}</p>
                      <p className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> {p.no_telephone}</p>
                      <p className="flex items-center gap-1.5"><Info className="w-4 h-4 text-gray-400" /> {p.alamat_perusahaan}</p>
                    </div>

                    {/* Tentang perusahaan */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {p.tentang_perusahaan || "Belum ada deskripsi perusahaan."}
                    </p>

                    {/* Footer Aksi */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <button className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1">
                        <Eye className="w-4 h-4" /> Detail
                      </button>
                      <button className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* === DATA PENCAKAR === */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-10">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800">Data Pencari Kerja</h3>
            <button
              onClick={() => router.push("/dashboardAdmin/Pencaker/tambah")}
              className="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#a00000] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {/* CARD PENCAKER */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataPencariKerja.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-6">Tidak ada data pencari kerja</p>
            ) : (
              dataPencariKerja.map((u, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl hover:border-[#800000]/40 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#800000] transition-colors">
                          {u.nama_lengkap}
                        </h4>
                        <p className="text-sm text-gray-500">{u.prodi || "Prodi tidak diketahui"}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Aktif</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {u.email}</p>
                      <p className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> {u.no_telephone}</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{u.tentang_anda || "Belum ada deskripsi diri."}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <button className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1">
                        <Eye className="w-4 h-4" /> Detail
                      </button>
                      <button className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* === DATA LOWONGAN (TETAP PREMIUM) === */}
        <LowonganSection dataLowongan={dataLowongan} router={router} />
      </div>
    </div>
  );
}

/* === KOMPONEN STAT CARD === */
function StatCard({ icon, title, value, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-lg text-white flex items-center justify-between`}>
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>
      <div className="bg-white/30 p-3 rounded-full">{icon}</div>
    </div>
  );
}

/* === KOMPONEN LOWONGAN === */
function LowonganSection({ dataLowongan, router }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-xl font-bold text-gray-800">Data Lowongan Kerja</h3>
        <button
          onClick={() => router.push("/dashboardPerusahaan/lowongan/tambah")}
          className="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#a00000] flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataLowongan.length === 0 ? (
          <p className="text-center col-span-full text-gray-500 py-6">Tidak ada data lowongan</p>
        ) : (
          dataLowongan.map((job, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl hover:border-[#800000]/40 hover:shadow-lg transition-all duration-300 overflow-hidden group">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#800000] transition-colors">
                      {job.nama_posisi}
                    </h4>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">{job.nama_perusahaan || "Perusahaan Tidak Diketahui"}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Aktif</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" /> {job.lokasi || "Tidak diketahui"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" /> Tutup:{" "}
                    {job.tanggal_ditutup
                      ? new Date(job.tanggal_ditutup).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                      : "-"}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {job.deskripsi_pekerjaan || "Tidak ada deskripsi lowongan."}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <button className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1">
                    <Eye className="w-4 h-4" /> Detail
                  </button>
                  <button className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
