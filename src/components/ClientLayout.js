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
    "/dashboardAdmin/pencaker/tambah",
    "/dashboardAdmin/perusahaan/tambah",
    "/dashboardAdmin/pengaturan",
  ];

  const isEditLowongan = pathname.startsWith(
    "/dashboardPerusahaan/lowongan/edit/");

  const isLowonganDetail = pathname.startsWith(
    "/lowongan/");
  
  const isKelolaAdmin_Perusahaan = pathname.startsWith(
    "/dashboardAdmin/perusahaan/kelola/");

  const isKelolaPencaker = pathname.startsWith(
    "/dashboardAdmin/pencaker/kelola/");

  const hideHeader =
  noHeaderPages.includes(pathname) ||
  isLowonganDetail || isEditLowongan 
  || isKelolaAdmin_Perusahaan || isKelolaPencaker;
  return (
    <> 
      {!hideHeader && <Header />}
      <main>{children}</main>
    </>
  );
}