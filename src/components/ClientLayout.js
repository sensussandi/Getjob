"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const noHeaderPages = [ "/loginMhs", "/dashboardMHS", "/pengaturan", "/profil", "/loginPerusahaan","/lengkapiDataMHS","/dashboardPerusahaan"];

  // Halaman tanpa header
  const noHeaderPages = [
    "/loginMhs",
    "/dashboardMHS",
    "/loginPerusahaan",
    "/lengkapiDataMHS",
    "/dashboardPerusahaan",
    "/dashboardPerusahaan/pengaturan",
    "/dashboardPerusahaan/lowongan/tambah",
  ];

  // ✅ Cek apakah path diawali dengan '/lowongan/' dan punya ID di belakang
  const isLowonganDetail = pathname.startsWith("/lowongan/");

  const hideHeader =
    noHeaderPages.includes(pathname) || isLowonganDetail;

  return (
    <>
      {!hideHeader && <Header />}
      <main>{children}</main>
    </>
  );
}
