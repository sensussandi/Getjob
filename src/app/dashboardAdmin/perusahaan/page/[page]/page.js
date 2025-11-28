"use client";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Mail, Phone, Info, Eye, Trash2, Building2,
  Plus, BarChart3, Settings, Bell, Users, Briefcase,
} from "lucide-react";

export default function PerusahaanPage({ params }) {
  useAdminAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const router = useRouter();
  const { page } = use(params);
  const currentPage = Number(page) || 1;
  const itemsPerPage = 9;

  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    perusahaan: 0,
    pencaker: 0,
    lowongan: 0,
  });


  // ===== Ambil data + statistik =====
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [resPerusahaan, resPencaker, resLowongan] = await Promise.all([
          fetch("/api/admin/perusahaan"),
          fetch("/api/admin/pencaker"),
          // kalau endpoint ini beda di punyamu, ganti ke yang benar (mis. /api/lowongan or /api/admin/lowongan)
          fetch("/api/perusahaan/lowongan").catch(() => null),
        ]);

        // --- perusahaan (data + paging) ---
        const perusahaanJson = await resPerusahaan.json();
        if (perusahaanJson?.success) {
          const list = perusahaanJson.data || [];
          setStats(s => ({ ...s, perusahaan: list.length }));

          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          setData(list);
          setFilteredData(list); // untuk tampilan awal sebelum search

        } else {
          setData([]);
          setStats(s => ({ ...s, perusahaan: 0 }));
        }

        // --- pencaker (hanya count) ---
        const pencakerJson = await resPencaker.json();
        setStats(s => ({
          ...s,
          pencaker: pencakerJson?.success ? (pencakerJson.data?.length || 0) : 0,
        }));

        // --- lowongan (hanya count; toleran kalau endpoint ga ada) ---
        if (resLowongan && resLowongan.ok) {
          const lowJson = await resLowongan.json();
          // sesuaikan property arraynya kalau berbeda (mis. lowJson.data)
          const arr = Array.isArray(lowJson) ? lowJson : (lowJson?.data || []);
          setStats(s => ({ ...s, lowongan: arr.length || 0 }));
        } else {
          setStats(s => ({ ...s, lowongan: 0 }));
        }
      } catch (e) {
        // fallback aman
        setData([]);
        setStats({ perusahaan: 0, pencaker: 0, lowongan: 0 });
      }
    };

    loadAll();
  }, [currentPage]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(data);
      return;
    }

    const lower = searchQuery.toLowerCase();
    setFilteredData(
      data.filter((p) =>
        p.nama_perusahaan.toLowerCase().includes(lower)
      )
    );
  }, [searchQuery, data]);


  const totalPages = Math.ceil(stats.perusahaan / itemsPerPage);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    router.push(`/dashboardAdmin/perusahaan/page/${p}`);
  };

  const handleDeletePerusahaan = async (id) => {
    if (!confirm("Yakin ingin menghapus perusahaan ini?")) return;

    const res = await fetch(`/api/admin/perusahaan/delete/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Berhasil menghapus perusahaan.");
      setData(prev => prev.filter((p) => p.id_admin !== id)); // update UI
    } else {
      alert("Gagal menghapus perusahaan.");
    }
  };

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* ===== HEADER MERAH ===== */}
        <div className="bg-gradient-to-r from-[#800000] to-[#b22222] text-white p-8 rounded-2xl shadow-lg mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/dashboardAdmin")}
              className="text-left group outline-none"
              aria-label="Ke Dashboard Admin"
            >
              <h1 className="text-3xl font-bold transition group-hover:opacity-90 group-focus:opacity-90">
                Dashboard Admin
              </h1>
              <p className="text-white/80 mt-2">Pantau seluruh aktivitas sistem GetJob</p>
            </button>

          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/20 px-5 py-2 rounded-xl text-sm backdrop-blur-sm flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              <span>Statistik Sistem</span>
            </div>

            <button
              onClick={() => router.push("/dashboardAdmin/pengaturan")}
              className="px-5 py-3 border-2 border-white/70 rounded-xl font-medium hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              <span>Pengaturan</span>
            </button>

            <button className="rounded-xl p-2.5 hover:bg-white/10 transition" aria-label="Notifikasi">
              <Bell className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={handleLogout}
              className="px-5 py-3 border-2 border-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ===== STAT CARDS (BIRU-HIJAU-KUNING) ===== */}
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

        {/* ===== KARTU PUTIH: JUDUL + TAMBAH + GRID + PAGINATION ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header kartu putih */}
          <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50 gap-3">

            {/* Judul */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Data Perusahaan</h2>
              <p className="text-sm text-gray-500">
                Total {stats.perusahaan} perusahaan
              </p>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 w-full md:w-80 text-black">
              <h1 className="text-2xl font-bold text-gray-900">Cari</h1>
              <input
                type="text"
                placeholder="Cari nama perusahaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] outline-none text-black"
              />
            </div>

            {/* Tombol Tambah */}
            <button
              onClick={() => router.push("/dashboardAdmin/perusahaan/tambah")}
              className="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#a00000] inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>

          </div>


          {/* Grid card perusahaan */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.length === 0 ? (
                <p className="col-span-full text-gray-500">Tidak ada data</p>
              ) : (
                filteredData.map((p) => (
                  <div
                    key={p.id_admin}
                    className="bg-white border border-gray-200 rounded-xl hover:border-[#800000]/40 hover:shadow-lg transition-all p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{p.nama_perusahaan}</h4>
                        <p className="text-sm text-gray-500">{p.nama_admin}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                        admin
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-gray-400" /> {p.email_perusahaan}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-gray-400" /> {p.no_telepone}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-gray-400" /> {p.alamat_perusahaan}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {p.tentang_perusahaan || "Belum ada deskripsi perusahaan."}
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <button
                        onClick={() => router.push(`/dashboardAdmin/perusahaan/kelola/${p.id_admin}`)}
                        className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1"
                      >
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
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                className={`px-4 py-2 rounded-lg border transition ${currentPage === 1
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
                    className={`px-4 py-2 rounded-lg border transition ${active
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
                className={`px-4 py-2 rounded-lg border transition ${currentPage === totalPages || totalPages === 0
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
    </div>
  );
}

/* ===== KOMPONEN STAT CARD (dengan badge bulat kanan) ===== */
function StatCard({ icon, title, value, color, onClick }) {
  const IconEl = cloneWithSize(icon, "w-5 h-5");

  return (
    <button
      onClick={onClick}
      className={`relative bg-gradient-to-r ${color} p-6 rounded-2xl shadow-lg text-white
      w-full text-left hover:opacity-90 transition overflow-hidden`}
    >
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>

      {/* badge ikon kanan */}
      <div className="absolute top-3 right-3 rounded-full p-3 bg-white/25 ring-1 ring-white/40 backdrop-blur-sm">
        {IconEl}
      </div>

      {/* soft glow */}
      <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full bg-black/10 blur-xl" />
    </button>
  );
}

/* helper kecil untuk set size icon lucide-react */
function cloneWithSize(el, cls) {
  return el && typeof el === "object"
    ? { ...el, props: { ...el.props, className: cls } }
    : el;
}
