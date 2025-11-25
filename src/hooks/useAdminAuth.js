"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function useAdminnAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("useAdminAuth session:", session);

  useEffect(() => {
    // Masih loading → jangan apa-apa dulu
    if (status === "loading") return;

    // Tidak login → lempar ke login
    if (!session) {
      router.replace("/loginPerusahaan");
      return;
    }

    // Login tapi bukan admin → tendang
    if (session.user.role !== "super_admin") {
      router.replace("/loginPerusahaan");
      return;
    }

  }, [session, status, router]);
}
