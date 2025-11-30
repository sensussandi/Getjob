"use client";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Mail,
  Phone,
  Info,
  Eye,
  Trash2,
  Plus,
  BarChart3,
  Settings,
  Bell,
  Building2,
  Briefcase,
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function PencakerPage({ params }) {
  useAdminAuth();
  const router = useRouter();
  const { page } = use(params);
  const currentPage = Number(page) || 1;
  const itemsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [allProdi, setAllProdi] = useState([]); // semua prodi untuk dropdown 
  const [notifications, setNotifications] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // button logout
  const unreadCount = notifications.filter(n => n.unread).length;

  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    perusahaan: 0,
    pencaker: 0,
    lowongan: 0,
  });

  // Bangun notifikasi dari dataPencariKerja yang minta reset
  useEffect(() => {
    const reqs = (data || []).filter(u => Number(u.reset_request) === 1);
    setNotifications(reqs.map(u => ({
      id: `reset-${u.nim}`,
      nim: u.nim,
      text: `Permintaan reset password: ${u.nama_lengkap} (${u.nim})`,
      // kalau punya kolom waktu, pakai itu; jika tidak, pakai label 'baru'
      time: u.reset_requested_at ? new Date(u.reset_requested_at).toLocaleString("id-ID") : "baru",
      unread: true,
    })));
  }, [data]);

  // ========== FETCH ALL STATS + PAGED DATA ==========
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [resPencaker, resPerusahaan, resLowongan] = await Promise.all([
          fetch("/api/admin/pencaker"),
          fetch("/api/admin/perusahaan"),
          fetch("/api/perusahaan/lowongan").catch(() => null),
        ]);

        // ---- PEMBAGIAN PENCAKER ----
        const pencakerJson = await resPencaker.json();
        if (pencakerJson?.success) {
          const list = pencakerJson.data || [];
          setStats((s) => ({ ...s, pencaker: list.length }));

          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          setData(list);
          setFilteredData(list);

          // Ambil prodi unik untuk dropdown
          const uniqueProdi = [...new Set(list.map((u) => u.prodi).filter(Boolean))];
          setAllProdi(uniqueProdi);

        }

        // ---- perusahaan count ----
        const perusahaanJson = await resPerusahaan.json();
        setStats((s) => ({
          ...s,
          perusahaan: perusahaanJson?.data?.length || 0,
        }));

        // ---- lowongan count ----
        if (resLowongan?.ok) {
          const lowJson = await resLowongan.json();
          const arr = Array.isArray(lowJson) ? lowJson : lowJson?.data || [];
          setStats((s) => ({ ...s, lowongan: arr.length || 0 }));
        }
      } catch (err) {
        setStats({ perusahaan: 0, pencaker: 0, lowongan: 0 });
        setData([]);
      }
    };

    loadAll();
  }, [currentPage]);

  useEffect(() => {
    let filtered = data;

    // Filter berdasarkan search (NIM atau Nama)
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter((u) =>
        u.nama_lengkap.toLowerCase().includes(lower) ||
        u.nim.toString().includes(lower)
      );
    }

    // Filter berdasarkan jurusan
    if (selectedProdi) {
      filtered = filtered.filter((u) => u.prodi === selectedProdi);
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setFilteredData(filtered.slice(start, end));


    setFilteredData(filtered);
  }, [searchQuery, selectedProdi, data, currentPage]);

  const totalPages = Math.ceil(stats.pencaker / itemsPerPage);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    router.push(`/dashboardAdmin/pencaker/page/${p}`);
  };

  const handleDeletePencaker = async (nim) => {
    if (!confirm("Yakin ingin menghapus pencari kerja ini?")) return;

    const res = await fetch(`/api/admin/pencaker/delete/${nim}`, {
      method: "DELETE",
    });
    const json = await res.json();

    if (json.success) {
      setData((prev) => prev.filter((u) => u.nim !== nim));
      alert("Berhasil menghapus pencari kerja.");
    } else {
      alert("Gagal menghapus pencari kerja.");
    }
  };

  const handleResetPassword = async (nim) => {
    if (!confirm("Reset password user ini ke DDMMYYYY dari tanggal lahir?"))
      return;

    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim }),
    });

    const json = await res.json();

    if (json.success) {
      alert(`Password berhasil direset ke: ${json.newPass}`);
      setData((prev) =>
        prev.map((u) =>
          u.nim === nim ? { ...u, reset_request: 0 } : u
        )
      );
    } else {
      alert(json.message || "Gagal mereset password.");
    }
  };

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* ========== HEADER MERAH (SAMA EXACT) ========== */}
        <div className="bg-gradient-to-r from-[#800000] to-[#b22222] text-white p-8 rounded-2xl shadow-lg mb-8 flex items-center justify-between">

          <button
            onClick={() => router.push("/dashboardAdmin")}
            className="text-left group outline-none"
          >
            <h1 className="text-3xl font-bold group-hover:opacity-90">
              Dashboard Admin
            </h1>
            <p className="text-white/80 mt-2">
              Pantau seluruh aktivitas sistem GetJob
            </p>
          </button>

          <div className="flex items-center gap-4">


            <button
              onClick={() => router.push("/dashboardAdmin/pengaturan")}
              className="px-5 py-3 border-2 border-white/70 rounded-xl hover:bg-white/10 flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Pengaturan
            </button>

            {/* Notifikasi */}
            <button
              onClick={() => setShowNotif(s => !s)}
              className="rounded-xl p-3 border-2 border-white/70 hover:bg-white/10
                               transition flex items-center justify-center relative"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-full 
                                       bg-white text-[#b22222] font-bold shadow">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* === TOMBOL LOGOUT === */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-5 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center gap-2 text-white"
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
        </div>

        {/* ========== STAT CARDS (BIRU – HIJAU – KUNING) ========== */}
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

        {/* ========== KARTU UTAMA LIST PENCAKER ========== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* HEADER KARTU PUTIH */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-5 border-b bg-gray-50">

            {/* Judul */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data Pencari Kerja</h2>
              <p className="text-sm text-gray-500">
                Total {stats.pencaker} pencaker • Halaman {currentPage}/{Math.max(totalPages, 1)}
              </p>
            </div>

            {/* Search & Dropdown */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto text-black">
              <h1 className="text-2xl font-bold text-gray-900">Cari</h1>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Cari nama atau NIM..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] outline-none w-full sm:w-60 text-black"
              />

              {/* Dropdown Prodi */}
              <select
                value={selectedProdi}
                onChange={(e) => setSelectedProdi(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#800000] outline-none w-full sm:w-60 text-black"
              >
                <option value="">Semua Jurusan</option>
                {allProdi.map((prodi) => (
                  <option key={prodi} value={prodi}>{prodi}</option>
                ))}
              </select>

            </div>

            {/* Tombol Tambah */}
            <button
              onClick={() => router.push("/dashboardAdmin/pencaker/tambah")}
              className="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#a00000] flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>

          </div>


          {/* GRID DATA PENCAKER */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredData.length === 0 ? (
              <p className="col-span-full text-gray-500">Tidak ada data</p>
            ) : (
              filteredData.map((u) => (
                <div
                  key={u.nim}
                  className="bg-white border border-gray-200 rounded-xl hover:border-[#800000]/40 hover:shadow-lg transition-all p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{u.nama_lengkap}</h4>
                      <p className="text-sm text-gray-500">
                        {u.nim || "nim tidak diketahui"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {u.prodi || "Prodi tidak diketahui"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Aktif</span>
                      {u.reset_request === 1 && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                          Minta reset
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-gray-400" /> {u.email}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-gray-400" /> {u.no_telephone}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {u.tentang_anda || "Belum ada deskripsi diri."}
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <button
                      onClick={() =>
                        router.push(`/dashboardAdmin/pencaker/kelola/${u.nim}`)
                      }
                      className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" /> kelola
                    </button>

                    <div className="flex items-center gap-3">
                      {u.reset_request === 1 && (
                        <button
                          onClick={() => handleResetPassword(u.nim)}
                          className="text-sm font-semibold px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                        >
                          Reset Password
                        </button>
                      )}

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

/* ========== KOMPONEN STAT CARD ========== */
function StatCard({ icon, title, value, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-lg text-white 
      w-full flex items-center justify-between hover:opacity-90 transition`}
    >
      <div className="text-left">
        <p className="text-white/80 text-sm">{title}</p>
        <h2 className="text-3xl font-bold mt-1">{value}</h2>
      </div>

      <div className="bg-white/30 p-3 rounded-full">
        {icon}
      </div>
    </button>
  );
}

