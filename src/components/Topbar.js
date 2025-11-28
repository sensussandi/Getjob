"use client";
import { useState } from "react";
import { Search, MapPin, Briefcase, Bell, HelpCircle, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "Profil Anda telah dilihat 5 perusahaan", time: "2 jam lalu", unread: true },
    { id: 2, text: "Ada 3 lowongan baru sesuai keahlian Anda", time: "5 jam lalu", unread: true },
    { id: 3, text: "Selamat! Lamaran Anda di PT Maju telah diterima", time: "1 hari lalu", unread: false },
  ]);

  const [keyword, setKeyword] = useState("");
  const [lokasi, setLokasi] = useState("Semua Lokasi");
  const [kategori, setKategori] = useState("Semua Pekerjaan");

  const router = useRouter();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (lokasi !== "Semua Lokasi") params.append("lokasi", lokasi);
    if (kategori !== "Semua Pekerjaan") params.append("kategori", kategori);

    router.push(`/hasilCariKerja?${params.toString()}`);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="px-4 md:px-6 py-4">

        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 mr-4 shrink-0">
            <img src="/logo.jpg" className="h-10 w-10 rounded-lg" alt="Logo" />
            <h1 className="text-xl font-bold text-red-900 tracking-wide">
              <span className="text-orange-600">USD Get Job</span>
            </h1>
          </div>

          {/* Search bar */}
          <div className="flex-1 flex items-center gap-3 max-w-4xl">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari pekerjaan atau perusahaan"
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div className="relative hidden md:block min-w-[180px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm"
              >
                <option>Semua Lokasi</option>
                <option>Jakarta</option>
                <option>Bandung</option>
                <option>Surabaya</option>
                <option>Yogyakarta</option>
              </select>
            </div>

            <div className="relative hidden lg:block min-w-[180px]">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm"
              >
                <option>Semua Pekerjaan</option>
                <option>IT/Software Development</option>
                <option>Marketing</option>
                <option>Design</option>
                <option>Finance</option>
                <option>HR</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="hidden md:flex bg-gradient-to-r from-red-900 to-red-700 text-white px-6 py-2.5 rounded-xl"
            >
              Cari
            </button>
          </div>

          {/* Notifikasi */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl hover:bg-slate-100"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-4 bg-gradient-to-r from-red-900 to-red-700 text-white">
                    <h3 className="font-bold text-lg">Notifikasi</h3>
                    <p className="text-sm text-red-100">{unreadCount} belum dibaca</p>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-4 border-b hover:bg-slate-50 ${n.unread ? "bg-red-50/30" : ""}`}>
                        <p className={`text-sm ${n.unread ? "font-semibold" : ""}`}>{n.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="p-2.5 rounded-xl hover:bg-slate-100 transition">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>

            <button className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 transition">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

          </div>
        </div>

      </div>
    </header>
  );
}