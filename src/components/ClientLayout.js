"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
<<<<<<< HEAD
  const noHeaderPages = [ "/loginMhs" , "/dashboardAdmin", "/loginPerusahaan","/lengkapiDataMHS","/dashboardPerusahaan","/dashboardPerusahaan/lowongan/tambah"];
=======

  // Halaman tanpa header
    const noHeaderPages = [
    "/loginMhs",
    "/dashboardMHS",
    "/loginPerusahaan",
    "/pengaturan",
    "/profil",
    "/lengkapiDataMHS",
    "/dashboardPerusahaan",
  ];

  // ✅ Cek apakah path diawali dengan '/lowongan/' dan punya ID di belakang
  const isLowonganDetail = pathname.startsWith("/lowongan/");

  const hideHeader =
    noHeaderPages.includes(pathname) || isLowonganDetail;
>>>>>>> b4a8147ca01a9c7441c4c15f81f14bbc17aeba08

  return (
    <>
      {!hideHeader && <Header />}
      <main>{children}</main>
    </>
  );
}
