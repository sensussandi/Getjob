"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Deteksi scroll arah
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowHeader(false); // Scroll ke bawah → sembunyikan
      } else {
        setShowHeader(true); // Scroll ke atas → tampilkan
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-red-900 shadow-md transition-transform duration-300 z-50 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3">
        
        {/* === KIRI: Logo + Menu Tengah === */}
        <div className="flex items-center space-x-10">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-8 w-8"
            />
            <div>
              <span className="text-xl font-bold text-white">USD</span>
              <span className="ml-1 text-sm text-orange-500 font-semibold">Get Job</span>
            </div>
          </div>

          {/* Menu Tengah */}
          <div className="hidden md:flex space-x-8 font-medium text-white">
            <a href="/pasang-loker" className="hover:text-[#FFD700] transition-colors">
              Pasang Loker
            </a>
            <a href="/cari-loker" className="hover:text-[#FFD700] transition-colors">
              Cari Loker
            </a>
          </div>
        </div>

        {/* === KANAN: Menu Registrasi / Perusahaan === */}
        <div className="flex items-center space-x-4">
          <a href="/loginMhs" className="text-white hover:text-[#FFD700] transition-colors">
            Login Mahasiswa
          </a>
          <a
            href="/perusahaan"
            className="bg-orange-600 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-700 transition-colors"
          >
            Login Perusahaan
          </a>
        </div>
      </div>
    </nav>
  );
}
