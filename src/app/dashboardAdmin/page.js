"use client";
import useAdminAuth from "@/hooks/useAdminAuth";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  Briefcase,
  BarChart3,
  Plus,
  Eye,
  Trash2,
  Settings,
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
  useAdminAuth();  // ⬅ proteksi berjalan otomatis
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // button logout
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
      const id = localStorage.getItem("id");
      const res = await fetch(`/api/admin?id=${id}`);
      const data = await res.json();

      if (!data.success) {
        console.error("API error");
        return;
      }

      setDataPerusahaan(data.adminPerusahaan || []);
      setDataPencariKerja(data.pencaker || []);
      setDataLowongan(data.lowongan || []);

      setStats({
        totalPerusahaan: data.adminPerusahaan?.length || 0,
        totalPencariKerja: data.pencaker?.length || 0,
        totalLowongan: data.lowongan?.length || 0
      });
    };

    fetchData();
  }, []);

  const handleDeletePerusahaan = async (id) => {
    if (!confirm("Yakin ingin menghapus perusahaan ini?")) return;

    const res = await fetch(`/api/admin/perusahaan/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Berhasil menghapus perusahaan.");
      setDataPerusahaan(prev => prev.filter((p) => p.id_admin !== id)); // update UI
    } else {
      alert("Gagal menghapus perusahaan.");
    }
  };

  const handleDeletePencaker = async (id) => {
    if (!confirm("Yakin ingin menghapus pencari kerja ini?")) return;

    const res = await fetch(`/api/admin/pencaker/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Berhasil menghapus pencari kerja.");
      setDataPencariKerja(prev => prev.filter((u) => u.nim !== id)); // update UI
    } else {
      alert("Gagal menghapus pencari kerja.");
    }
  };

  const handleDeleteLowongan = async (id) => {
    if (!confirm("Yakin ingin menghapus loker ini?")) return;

    const res = await fetch(`/api/lowongan/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Berhasil menghapus loker.");
      setDataLowongan(prev => prev.filter((job) => job.id.lowongan !== id)); // update UI
    } else {
      alert("Gagal menghapus loker.");
    }
  };

  const handleLogout = () => {
    // Hapus cookie
    document.cookie = "id=; Max-Age=0; path=/; SameSite=Lax";
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
          {/* === TOMBOL Setting === */}
          <button
            onClick={() => router.push("/dashboardAdmin/pengaturan")}
            className="px-5 py-3 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2 text-black-700"
          >
            <Settings className="w-5 h-5" />
            <span>Pengaturan</span>
          </button>

          {/* === TOMBOL LOGOUT === */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-5 py-3 border-2 border-black-400 text-black-600 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
          >
            <span>Logout</span>
          </button>
          {showLogoutModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-[340px]">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Konfirmasi Logout</h3>
                <p className="text-gray-600 mb-5">Apakah Anda yakin ingin logout dari akun ini?</p>

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

        {/* STATISTIK */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Building2 />} title="Total Perusahaan" value={stats.totalPerusahaan} color="from-blue-500 to-blue-600" />
          <StatCard icon={<Users />} title="Total Pencari Kerja" value={stats.totalPencariKerja} color="from-green-500 to-green-600" />
          <StatCard icon={<Briefcase />} title="Total Lowongan" value={stats.totalLowongan} color="from-yellow-500 to-yellow-600" />
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
              dataPerusahaan.map((p) => (
                <div
                  key={p.id_admin}
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

                    {/* kelola */}
                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {p.email_perusahaan}</p>
                      <p className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> {p.no_telepone}</p>
                      <p className="flex items-center gap-1.5"><Info className="w-4 h-4 text-gray-400" /> {p.alamat_perusahaan}</p>
                    </div>

                    {/* Tentang perusahaan */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {p.tentang_perusahaan || "Belum ada deskripsi perusahaan."}
                    </p>

                    {/* Footer Aksi */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <button
                        onClick={() => router.push(`/dashboardAdmin/perusahaan/kelola/${p.id_admin}`)}
                        className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1">
                        <Eye className="w-4 h-4" /> kelola
                      </button>
                      <button
                        onClick={() => handleDeletePerusahaan(p.id_admin)}
                        className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1"
                      >
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
              onClick={() => router.push("/dashboardAdmin/pencaker/tambah")}
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
                  key={u.nim}
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
                      <button onClick={() => router.push(`/dashboardAdmin/pencaker/kelola/${u.nim}`)}
                        className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1">
                        <Eye className="w-4 h-4" /> kelola
                      </button>
                      <button
                        onClick={() => handleDeletePencaker(u.nim)}
                        className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1"
                      >
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
        <LowonganSection dataLowongan={dataLowongan} router={router} handleDeleteLowongan={handleDeleteLowongan} 
/>
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
function LowonganSection({ dataLowongan, router, handleDeleteLowongan}) {
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
          dataLowongan.map((job) => (
            <div key={job.id_lowongan} className="bg-white border border-gray-200 rounded-xl hover:border-[#800000]/40 hover:shadow-lg transition-all duration-300 overflow-hidden group">
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
                  <button onClick={() => router.push(`/dashboardPerusahaan/lowongan/edit/${job.id_lowongan}`)}
                    className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1">
                    <Eye className
                    ="w-4 h-4" /> kelola
                  </button>
                  <button
                    onClick={() => handleDeleteLowongan(job.id_lowongan)}
                    className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1"
                  >
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
