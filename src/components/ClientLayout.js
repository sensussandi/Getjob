"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Halaman tanpa header
    const noHeaderPages = [
    "/loginMhs",
    "/dashboardMHS",
    "/loginPerusahaan",
    "/pengaturan",
    "/profil",
    "/lengkapiDataMHS",
    "/dashboardPerusahaan",
    "/dashboardAdmin",
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
