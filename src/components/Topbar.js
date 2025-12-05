"use client";
import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Topbar() {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [lokasi, setLokasi] = useState("Semua Lokasi");
  const [kategori, setKategori] = useState("Semua Pekerjaan");
  const [showNewNotification, setShowNewNotification] = useState(false);

  const router = useRouter();

  // ===============================
  // Ambil Notifikasi dari Database
  // ===============================
  useEffect(() => {
    if (!session?.user?.id) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/notifikasiLokerPencariKerja?nim=${session.user.id}`);
        const result = await res.json();

        if (result.success) {
          // Jika ada notif baru, munculkan alert animasi
          const newUnread = result.data.filter((n) => n.unread).length;
          if (newUnread > unreadCount) {
            setShowNewNotification(true);

            // sembunyikan alert setelah 3 detik
            setTimeout(() => setShowNewNotification(false), 3000);
          }

          setNotifications(result.data);
          setUnreadCount(newUnread);
        }
      } catch (error) {
        console.error("Gagal auto-refresh notif:", error);
      }
    }, 10000); // cek tiap 10 detik

    return () => clearInterval(interval);
  }, [session, unreadCount]);

  // ===============================
  // Fungsi Search
  // ===============================
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (lokasi !== "Semua Lokasi") params.append("lokasi", lokasi);
    if (kategori !== "Semua Pekerjaan") params.append("kategori", kategori);

    router.push(`/hasilCariKerja?${params.toString()}`);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mr-4 shrink-0">
            <img src="/logo.jpg" className="h-10 w-10 rounded-lg" alt="Logo" />
            <h1 className="text-xl font-bold text-red-900 tracking-wide">
              <span className="text-orange-600">USD Get Job</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex items-center gap-3 max-w-4xl">
            {/* Keyword */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Cari pekerjaan atau perusahaan"
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Lokasi */}
            <div className="relative hidden md:block min-w-[180px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select value={lokasi} onChange={(e) => setLokasi(e.target.value)} className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm text-gray-800">
                <option>Semua Lokasi</option>
                <option>Jakarta</option>
                <option>Bandung</option>
                <option>Surabaya</option>
                <option>Yogyakarta</option>
              </select>
            </div>

            {/* Tipe Pekerjaan */}
            <div className="relative hidden lg:block min-w-[180px]">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm text-gray-800">
                <option>Tipe Pekerjaan</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
                <option>Intership</option>
                <option>Freelance</option>
              </select>
            </div>

            <button onClick={handleSearch} className="hidden md:flex bg-gradient-to-r from-red-900 to-red-700 text-white px-6 py-2.5 rounded-xl">
              Cari
            </button>
          </div>

          {/* Notifikasi */}
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 rounded-xl hover:bg-slate-100">
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="p-4 bg-gradient-to-r from-red-900 to-red-700 text-white">
                  <h3 className="font-bold text-lg">🔔 Notifikasi Baru</h3>
                  <p className="text-sm text-red-100">{unreadCount} belum dibaca</p>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">Tidak ada notifikasi</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={async () => {
                          await fetch("/api/notifikasiLokerPencariKerja/read", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id_pendaftaran: n.id_pendaftaran,
                            }),
                          });

                          // update UI setelah dibaca
                          setNotifications((prev) => prev.map((item) => (item.id_pendaftaran === n.id_pendaftaran ? { ...item, unread: false } : item)));

                          setUnreadCount((prev) => prev - 1);
                        }}
                        className={`p-4 border-b hover:bg-slate-100 cursor-pointer ${n.unread ? "bg-red-50" : "bg-white"}`}
                      >
                        <p className="text-sm font-medium text-gray-800">{n.pesan}</p>
                        <p className="text-xs text-gray-500 mt-1">{n.waktu}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 transition">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
