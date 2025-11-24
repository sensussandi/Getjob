"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) setShowHeader(false);
      else setShowHeader(true);

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
        <div className="flex items-center space-x-10">
          <div
            onClick={() => router.push("/")}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
          >
            <img src="/logo.jpg" alt="Logo" className="h-8 w-8" />
            <div>
              <span className="text-xl font-bold text-white">USD</span>
              <span className="ml-1 text-sm text-orange-500 font-semibold">
                Get Job
              </span>
            </div>
          </div>

          <div className="hidden md:flex space-x-8 font-medium text-white">
            <Link href="/pasang-loker" className="hover:text-[#FFD700] transition-colors">
              Pasang Loker
            </Link>
            <Link href="/cari-loker" className="hover:text-[#FFD700] transition-colors">
              Cari Loker
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/loginMhs" className="text-white hover:text-[#FFD700] transition-colors">
            Login Mahasiswa
          </Link>
          <Link
            href="/loginPerusahaan"
            className="bg-orange-600 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-700 transition-colors"
          >
            Login Perusahaan
          </Link>
        </div>
      </div>
    </nav>
  );
}