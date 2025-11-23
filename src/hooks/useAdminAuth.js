"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAdminAuth() {
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id) {
      router.replace("/loginPerusahaan");
    }
  }, []);

  return null;
}
