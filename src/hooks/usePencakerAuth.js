"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function usePencakerAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // console.log("useAdminPerusahaanAuth session:", session);
  useEffect(() => {
    // Masih loading → jangan apa-apa dulu
    if (status === "loading") return;
    
    // Tidak login → lempar ke login
    if (!session) {
      router.replace("/loginMhs");
      return;
    }

    // Login tapi bukan mahasiswa → tendang
    if (session.user.role !== "alumni") {
      router.replace("/loginMhs");
      return;
    }

  }, [session, status, router]);
}
