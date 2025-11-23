"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAdminPerusahaanAuth() {
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("id_admin");
    if (!id) {
      router.replace("/loginPerusahaan");
    }
  }, []);

  return null;
}
