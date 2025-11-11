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
<<<<<<< HEAD
    "/dashboardAdmin",
=======
    "/editProfileMHS",
    "/dashboardPerusahaan/pengaturan",
    "/dashboardPerusahaan/lowongan/tambah",
>>>>>>> 42088b622a1e2466c89ab486238d7f9559c23fab
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
