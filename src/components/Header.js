"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  // === ❌ SEMBUNYIKAN HEADER PADA HALAMAN DASHBOARD ===
  const hiddenRoutes = ["/dashboardMHS", "dashboarPerusahaan", "dashboardAdmin", "/lamaran", "/lihatLokerSaya", "/profil", "/pengaturan"];

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

  // === ARAHKAN SESUAI ROLE ===
  const goToDashboard = () => {
    if (!session) return;

    if (session.user.role === "alumni") router.push("/dashboardMHS");
    else if (session.user.role === "admin") router.push("/dashboardPerusahaan");
    else if (session.user.role === "super_admin") router.push("/dashboardAdmin");
  };


  return (
    <nav className={`fixed top-0 left-0 w-full bg-red-900 shadow-md transition-transform duration-300 z-50 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-3">
        {/* LEFT: Logo + Menu */}
        <div className="flex items-center space-x-10">
          {/* Logo */}
          <div onClick={handleLogoClick} className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition">
            <img src="/logo.jpg" alt="Logo" className="h-8 w-8" />
            <div>
              <span className="text-xl font-bold text-white">USD</span>
              <span className="ml-1 text-sm text-orange-500 font-semibold">Get Job</span>
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

        {/* RIGHT: LOGIN / PROFIL */}
        <div className="flex items-center space-x-4">

          {/* === USER BELUM LOGIN === */}
          {!session && (
            <>
              <a href="/loginMhs" className="text-white hover:text-[#FFD700]">
                Login Mahasiswa
              </a>
              <a href="/loginPerusahaan" className="bg-orange-600 text-white px-4 py-2 rounded-md">
                Login Perusahaan
              </a>
            </>
          )}

          {/* === USER SUDAH LOGIN === */}
          {session && (
            <button
              onClick={goToDashboard}
              className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold text-gray-800 text-sm">
                  {session.user.nama_lengkap || session.user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {session.user.email}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
