"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  // === ❌ SEMBUNYIKAN HEADER PADA HALAMAN DASHBOARD ===
  const hiddenRoutes = ["/dashboardMHS", "/lamaran", "/lihatLokerSaya", "/profil", "/pengaturan"];

  // Jika path saat ini dimulai dengan salah satu route di atas → jangan tampilkan Header
  if (hiddenRoutes.some((r) => pathname.startsWith(r))) {
    return null;
  }

  // === DETEKSI SCROLL ===
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Klik logo → kembali ke halaman utama
  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <nav className={`fixed top-0 left-0 w-full bg-gradient-to-r from-[#0f5132] via-[#146c43] to-[#0f5132] shadow-lg transition-transform duration-300 z-50 border-b-2 border-red-500 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
      {/* Christmas Decoration Dots */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-white to-red-500"></div>
      
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3 relative">
        {/* Decorative Christmas Elements */}
        <div className="absolute -top-1 left-20 text-sm opacity-60 animate-bounce">🎄</div>
        <div className="absolute -top-1 right-20 text-sm opacity-60 animate-pulse">❄️</div>
        
        {/* LEFT: Logo + Menu */}
        <div className="flex items-center space-x-10">
          {/* Logo */}
          <div onClick={handleLogoClick} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition group">
            <div className="relative">
              <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 text-xs">🎅</div>
            </div>
            <div>
              <span className="text-xl font-bold text-white">USD</span>
              <span className="ml-1 text-sm text-red-400 font-semibold">Get</span>
            </div>
          </div>

          {/* Menu Tengah */}
          <div className="hidden md:flex space-x-8 font-medium text-white">
            <a href="/pasang-loker" className="hover:text-red-300 transition-colors flex items-center gap-1">
               Pasang Loker
            </a>
            <a href="/cari-loker" className="hover:text-red-300 transition-colors flex items-center gap-1">
               Cari Loker
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-4">
          <a href="/loginMhs" className="text-white hover:text-red-300 transition-colors font-medium flex items-center gap-1">
             Login Mahasiswa
          </a>
          <a href="/loginPerusahaan" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg border-2 border-white flex items-center gap-1">
             Login Perusahaan
          </a>
        </div>
      </div>
    </nav>
  );
}