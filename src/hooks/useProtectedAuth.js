"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useProtectedAuth() {
  const router = useRouter();

  useEffect(() => {
    const idSuperAdmin = localStorage.getItem("id"); // super_admin
    const idAdminPerusahaan = localStorage.getItem("id_admin"); // perusahaan

    // Jika dua-duanya tidak ada → tidak boleh masuk
    if (!idSuperAdmin && !idAdminPerusahaan) {
      router.replace("/loginPerusahaan");
    }
  }, []);

  return null;
}
