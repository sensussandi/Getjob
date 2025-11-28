"use client";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Settings,
  Bell,
  Plus,
  Eye,
  Trash2,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  Users,
} from "lucide-react";

import { signOut } from "next-auth/react";

export default function LowonganPaged({ params }) {
  useAdminAuth();
  const router = useRouter();
  const { page } = use(params);
  const currentPage = Number(page) || 1;
  const itemsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allProdi, setAllProdi] = useState([]);

  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    perusahaan: 0,
    pencaker: 0,
    lowongan: 0,
  });

  // ========== FETCH DATA + STAT ==========

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [resLoker, resPencaker, resPerusahaan] = await Promise.all([
          fetch("/api/perusahaan/lowongan"),
          fetch("/api/admin/pencaker"),
          fetch("/api/admin/perusahaan"),
        ]);

        // ---- LOWONGAN ----
        const lowJson = await resLoker.json();
        const list = Array.isArray(lowJson) ? lowJson : lowJson.data || [];
        setStats((s) => ({ ...s, lowongan: list.length }));

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setData(list);       // simpan semua data asli
        setFilteredData(list);

        // Ambil semua kategori prodi unik untuk dropdown
        const uniqueProdi = [...new Set(list.map((l) => l.kategori_prodi || l.prodi || "").filter(Boolean))];
        setAllProdi(uniqueProdi);


        // ---- PENCAKER ----
        const pcJson = await resPencaker.json();
        setStats((s) => ({ ...s, pencaker: pcJson.data?.length || 0 }));

        // ---- PERUSAHAAN ----
        const prJson = await resPerusahaan.json();
        setStats((s) => ({ ...s, perusahaan: prJson.data?.length || 0 }));
      } catch (err) {
        setData([]);
      }
    };
    loadAll();
  }, [currentPage]);

  useEffect(() => {
    let filtered = data;

    // FILTER SEARCH (nama posisi, perusahaan, lokasi)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((l) =>
        l.nama_posisi.toLowerCase().includes(q) ||
        l.nama_perusahaan?.toLowerCase().includes(q) ||
        l.lokasi?.toLowerCase().includes(q)
      );
    }

    // FILTER PRODI
    if (selectedProdi) {
      filtered = filtered.filter((l) =>
        (l.kategori_prodi || l.prodi || "") === selectedProdi
      );
    }

    setFilteredData(filtered);
  }, [searchQuery, selectedProdi, data]);


  const totalPages = Math.ceil(stats.lowongan / itemsPerPage);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    router.push(`/dashboardPerusahaan/lowongan/page/${p}`);
  };

  const handleDeleteLowongan = async (id) => {
    if (!confirm("Yakin ingin menghapus lowongan ini?")) return;

    const res = await fetch(`/api/lowongan/delete/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();

    if (json.success) {
      alert("Berhasil menghapus lowongan.");
      setData((prev) => prev.filter((item) => item.id_lowongan !== id));
    } else {
      alert("Gagal menghapus lowongan.");
    }
  };

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER MERAH ================= */}
        <div className="bg-gradient-to-r from-[#800000] to-[#b22222] text-white p-8 rounded-2xl shadow-lg mb-8 flex justify-between items-center">

          <button
            onClick={() => router.push("/dashboardAdmin")}
            className="text-left group outline-none"
          >
            <h1 className="text-3xl font-bold group-hover:opacity-90">
              Dashboard Admin
            </h1>
            <p className="text-white/80 mt-2">Kelola seluruh lowongan pekerjaan</p>
          </button>

          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-5 py-2 rounded-xl text-sm flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span>Statistik Sistem</span>
            </div>

            <button
              onClick={() => router.push("/dashboardAdmin/pengaturan")}
              className="px-5 py-3 border-2 border-white/70 rounded-xl hover:bg-white/10 flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Pengaturan
            </button>

            <button className="rounded-xl p-2.5 hover:bg-white/10 transition">
              <Bell className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-3 border-2 border-white rounded-xl font-semibold hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ================= STAT CARD ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

          <StatCard
            icon={<Building2 />}
            title="Total Perusahaan"
            value={stats.perusahaan}
            color="from-blue-500 to-blue-600"
            onClick={() => router.push("/dashboardAdmin/perusahaan/page/1")}
          />

          <StatCard
            icon={<Users />}
            title="Total Pencari Kerja"
            value={stats.pencaker}
            color="from-green-500 to-green-600"
            onClick={() => router.push("/dashboardAdmin/pencaker/page/1")}
          />

          <StatCard
            icon={<Briefcase />}
            title="Total Lowongan"
            value={stats.lowongan}
            color="from-yellow-500 to-yellow-600"
            onClick={() => router.push("/dashboardAdmin/lowongan/page/1")}
          />
        </div>

        {/* ================= KARTU LOWONGAN ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Header Kartu */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-6 py-5 border-b bg-gray-50">

            {/* Judul */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data Lowongan</h2>
              <p className="text-sm text-gray-500">
                Total {stats.lowongan} lowongan • Halaman {currentPage}/{Math.max(totalPages, 1)}
              </p>
            </div>

            {/* Search bar + Dropdown */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

              {/* SEARCH INPUT */}
              <div className="relative w-full sm:w-64 text-black">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari posisi, perusahaan, atau lokasi..."
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] outline-none text-black"
                />
                <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              {/* DROPDOWN KATEGORI PRODI */}
              <select
                value={selectedProdi}
                onChange={(e) => setSelectedProdi(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 w-full sm:w-56 focus:ring-2 focus:ring-[#800000] outline-none text-black"
              >
                <option value="">Semua Kategori Prodi</option>
                {allProdi.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

            </div>

            {/* Tombol Tambah */}
            <button
              onClick={() => router.push("/dashboardPerusahaan/lowongan/tambah")}
              className="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#a00000] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>

          </div>


          {/* Grid Lowongan */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.length === 0 ? (
              <p className="col-span-full text-gray-500">Tidak ada data</p>
            ) : (
              filteredData.map((job) => (
                <div key={job.id_lowongan}
                  className="bg-white border border-gray-200 rounded-xl hover:border-[#800000]/40 hover:shadow-lg transition-all p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{job.nama_posisi}</h4>
                      <p className="text-sm text-gray-500">
                        {job.nama_perusahaan || "Perusahaan tidak diketahui"}
                      </p>
                    </div>

                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Aktif
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" /> {job.lokasi}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Tutup:{" "}
                      {job.tanggal_ditutup
                        ? new Date(job.tanggal_ditutup).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {job.deskripsi_pekerjaan || "Tidak ada deskripsi lowongan."}
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <button
                      onClick={() =>
                        router.push(`/dashboardPerusahaan/lowongan/edit/${job.id_lowongan}`)
                      }
                      className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> kelola
                    </button>

                    <button
                      onClick={() => handleDeleteLowongan(job.id_lowongan)}
                      className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-3 mt-10 mb-8">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className={`px-4 py-2 rounded-lg border ${currentPage === 1
                ? "text-gray-400 border-gray-200 bg-gray-50"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              Prev
            </button>

            {[...Array(totalPages || 1)].map((_, i) => {
              const p = i + 1;
              const active = currentPage === p;
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`px-4 py-2 rounded-lg border ${active
                    ? "bg-[#800000] text-white border-[#800000] shadow"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => goToPage(currentPage + 1)}
              className={`px-4 py-2 rounded-lg border ${currentPage === totalPages || totalPages === 0
                ? "text-gray-400 border-gray-200 bg-gray-50"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENT STAT CARD ================= */
function StatCard({ icon, title, value, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-lg text-white 
        flex items-center justify-between w-full text-left hover:opacity-90 transition`}
    >
      <div className="text-left">
        <p className="text-white/80 text-sm">{title}</p>
        <h2 className="text-3xl font-bold mt-1">{value}</h2>
      </div>
      <div className="bg-white/30 p-3 rounded-full">{icon}</div>
    </button>
  );
}
