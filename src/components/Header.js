"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  // === ❌ SEMBUNYIKAN HEADER PADA HALAMAN DASHBOARD ===
  const hiddenRoutes = [
    "/dashboardMHS",
    "/lamaran",
    "/statistik",
    "/profil",
    "/pengaturan",
  ];

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
    <nav
      className={`fixed top-0 left-0 w-full bg-red-900 shadow-md transition-transform duration-300 z-50 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3">
        {/* LEFT: Logo + Menu */}
        <div className="flex items-center space-x-10">
          {/* Logo */}
          <div
            onClick={handleLogoClick}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
          >
            <img src="/logo.jpg" alt="Logo" className="h-8 w-8" />
            <div>
              <span className="text-xl font-bold text-white">USD</span>
              <span className="ml-1 text-sm text-orange-500 font-semibold">
                Get
              </span>
            </div>
          </div>

          {/* Menu Tengah */}
          <div className="hidden md:flex space-x-8 font-medium text-white">
            <a href="/pasang-loker" className="hover:text-[#FFD700]">
              Pasang Loker
            </a>
            <a href="/cari-loker" className="hover:text-[#FFD700]">
              Cari Loker
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-4">
          <a href="/loginMhs" className="text-white hover:text-[#FFD700]">
            Login Mahasiswa
          </a>
          <a
            href="/loginPerusahaan"
            className="bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            Login Perusahaan
          </a>
        </div>
      </div>
    </nav>
  );
}
