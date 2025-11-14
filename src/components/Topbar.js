"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Bell, HelpCircle, Menu } from "lucide-react";

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

  // Aksi ketika user klik tombol "Cari"
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
          {/* Search Section */}
          <div className="flex-1 flex items-center gap-3 max-w-4xl">
            {/* Keyword Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pekerjaan atau perusahaan"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white hover:border-slate-400 text-sm"
              />
            </div>

            {/* Location Filter */}
            <div className="relative hidden md:block min-w-[180px]">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white hover:border-slate-400 appearance-none text-sm cursor-pointer"
              >
                <option>Semua Lokasi</option>
                <option>Jakarta</option>
                <option>Bandung</option>
                <option>Surabaya</option>
                <option>Semarang</option>
                <option>Yogyakarta</option>
                <option>Remote</option>
              </select>
            </div>

            {/* Job Category Filter */}
            <div className="relative hidden lg:block min-w-[200px]">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white hover:border-slate-400 appearance-none text-sm cursor-pointer"
              >
                <option>Semua Pekerjaan</option>
                <option>IT/Software Development</option>
                <option>Marketing</option>
                <option>Design</option>
                <option>Finance</option>
                <option>Human Resources</option>
                <option>Sales</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="hidden md:flex items-center justify-center bg-gradient-to-r from-red-900 to-red-700 text-white px-6 py-2.5 rounded-xl hover:from-red-800 hover:to-red-600 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Cari
            </button>
          </div>

          {/* Right Section (notifikasi dll) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors group"
            >
              <Bell className="w-5 h-5 text-gray-600 group-hover:text-red-900 transition" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors group">
              <HelpCircle className="w-5 h-5 text-gray-600 group-hover:text-red-900 transition" />
            </button>

            <button className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors group">
              <Menu className="w-5 h-5 text-gray-600 group-hover:text-red-900 transition" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}