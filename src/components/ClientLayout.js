"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const noHeaderPages = [ "/loginMhs", "/dashboardMHS", "/loginPerusahaan","/lengkapiDataMHS","/dashboardPerusahaan","/dashboardPerusahaan/lowongan/tambah"];

  return (
    <>
      {!noHeaderPages.includes(pathname) && <Header />}
      <main>{children}</main>
    </>
  );
}
