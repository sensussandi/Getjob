"use client";
import useAdminAuth from "@/hooks/useAdminAuth";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
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
  Bell,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardAdmin() {
  useAdminAuth();  // ⬅ proteksi berjalan otomatis
  const router = useRouter();
  const [data, setData] = useState({});
  const [stats, setStats] = useState({
    totalPerusahaan: 0,
    totalPencariKerja: 0,
    totalLowongan: 0,
  });

  const [dataPerusahaan, setDataPerusahaan] = useState([]);
  const [dataPencariKerja, setDataPencariKerja] = useState([]);
  const [dataLowongan, setDataLowongan] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // button logout

  // ⬅ ambil session paling atas
  const { data: session, status } = useSession();


  // Ambil data dari backend
  useEffect(() => {
    if (!session || session.user.role !== "super_admin") return;
    const fetchData = async () => {
      const res = await fetch(`/api/admin?id=${session.user.id}`);
      const result = await res.json();

      if (result.success) {
        setData(result);
        setDataPerusahaan(result.adminPerusahaan || []);
        setDataPencariKerja(result.pencaker || []);
        setDataLowongan(result.lowongan || []);

        setStats({
          totalPerusahaan: result.adminPerusahaan?.length || 0,
          totalPencariKerja: result.pencaker?.length || 0,
          totalLowongan: result.lowongan?.length || 0
        });
      } else {
        console.error(result.message);
      }

    };

    fetchData();
  }, [session]);

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

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/" });
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
      setDataLowongan(prev => prev.filter((job) => job.id_lowongan !== id)); // update UI
    } else {
      alert("Gagal menghapus loker.");
    }
  };

  // ======== Notifikasi Reset Password ========
  const notifRef = useRef(null);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => n.unread).length;

  // Bangun notifikasi dari dataPencariKerja yang minta reset
  useEffect(() => {
    const reqs = (dataPencariKerja || []).filter(u => Number(u.reset_request) === 1);
    setNotifications(reqs.map(u => ({
      id: `reset-${u.nim}`,
      nim: u.nim,
      text: `Permintaan reset password: ${u.nama_lengkap} (${u.nim})`,
      // kalau punya kolom waktu, pakai itu; jika tidak, pakai label 'baru'
      time: u.reset_requested_at ? new Date(u.reset_requested_at).toLocaleString("id-ID") : "baru",
      unread: true,
    })));
  }, [dataPencariKerja]);

  // Tutup dropdown kalau klik di luar (global mousedown)
  useEffect(() => {
    const onDown = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    if (showNotif) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showNotif]);

  const goToResetPanel = () => {
    document
      .getElementById("reset-password-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowNotif(false); // kalau kamu pakai state dropdown
  };

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const toggleRead = (id) =>
    setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, unread: !n.unread }) : n));

  const handleResetPassword = async (nim) => {
    if (!confirm("Reset password user ini ke format DDMMYYYY dari tanggal lahir?")) return;

    const res = await fetch("/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nim }),
    });

    const data = await res.json();
    if (data.success) {
      alert(`Password berhasil direset ke: ${data.newPass}`);
      // bersihkan badge/flag di UI
      setDataPencariKerja(prev =>
        prev.map(u => u.nim === nim ? { ...u, reset_request: 0 } : u)
      );
    } else {
      alert(data.message || "Gagal mereset password.");
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#800000] to-[#b22222] text-white p-8 rounded-2xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* Kiri - Judul */}
            <button
              onClick={() => router.push("/dashboardAdmin")}
              className="text-left group outline-none"
            >
              <h1 className="text-3xl font-bold group-hover:opacity-90">
                Dashboard Admin
              </h1>
              <p className="text-white/80 mt-1 text-sm">
                Pantau seluruh aktivitas sistem GetJob
              </p>
            </button>

            {/* Kanan - Tombol */}
            <div className="flex items-center gap-4">

              {/* Pengaturan */}
              <button
                onClick={() => router.push("/dashboardAdmin/pengaturan")}
                className="px-5 py-3 border-2 border-white/70 rounded-xl font-medium 
                   hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                <span>Pengaturan</span>
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
        </div>


        {/* STATISTIK */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Building2 />} title="Total Perusahaan" value={stats.totalPerusahaan} color="from-blue-500 to-blue-600" onClick={() => router.push("/dashboardAdmin/perusahaan/page/1")} />
          <StatCard icon={<Users />} title="Total Pencari Kerja" value={stats.totalPencariKerja} color="from-green-500 to-green-600" onClick={() => router.push("/dashboardAdmin/pencaker/page/1")} />
          <StatCard icon={<Briefcase />} title="Total Lowongan" value={stats.totalLowongan} color="from-yellow-500 to-yellow-600" onClick={() => router.push("/dashboardAdmin/lowongan/page/1")} />
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
              dataPerusahaan.slice(0, 3).map((p) => (
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
                        {p.role || "super_admin"}
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

        {/* === DATA PENCAKER === */}
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
              dataPencariKerja.slice(0, 3).map((u) => (
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
                        <p className="text-sm text-gray-500">{u.nim || "nim tidak diketahui"}</p>
                        <p className="text-sm text-gray-500">{u.prodi || "Prodi tidak diketahui"}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* status aktif */}
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          Aktif
                        </span>
                        {/* badge permintaan reset */}
                        {u.reset_request === 1 && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                            Minta reset
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {u.email}</p>
                      <p className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> {u.no_telephone}</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{u.tentang_anda || "Belum ada deskripsi diri."}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <button
                        onClick={() => router.push(`/dashboardAdmin/pencaker/kelola/${u.nim}`)}
                        className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> kelola
                      </button>

                      <div className="flex items-center gap-3">
                        {/* TOMBOL RESET PASSWORD: hanya muncul bila ada request */}
                        {u.reset_request === 1 && (
                          <button
                            onClick={() => handleResetPassword(u.nim)}
                            className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700"
                            title="Reset password ke DDMMYYYY dari tanggal lahir"
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
function StatCard({ icon, title, value, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-lg text-white 
      flex items-center justify-between w-full text-left hover:opacity-90 transition`}
    >
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>
      <div className="bg-white/30 p-3 rounded-full">{icon}</div>
    </button>
  );
}


/* === KOMPONEN LOWONGAN === */
function LowonganSection({ dataLowongan, router, handleDeleteLowongan }) {
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
          dataLowongan.slice(0, 3).map((job) => (
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

                  <button
                    onClick={() => router.push(`/dashboardPerusahaan/lowongan/edit/${job.id_lowongan}`)}
                    className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> kelola
                  </button>

                  <button
                    onClick={() => router.push(`/dashboardAdmin/lowongan/detail/${job.id_lowongan}`)}
                    className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Users className="w-4 h-4" /> Detail
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