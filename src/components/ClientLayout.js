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
    "/editProfileMHS",
    "/dashboardPerusahaan/pengaturan",
    "/dashboardPerusahaan/lowongan/tambah",
  ];

  const isEditLowongan = pathname.startsWith(
    "/dashboardPerusahaan/lowongan/edit/"
  );

  const isLowonganDetail = pathname.startsWith("/lowongan/");
  
  const hideHeader =
  noHeaderPages.includes(pathname) ||
  isLowonganDetail ||
  isEditLowongan;
  return (
    <> 
      {!hideHeader && <Header />}
      <main>{children}</main>
    </>
  );
}