import { NextResponse } from "next/server";
import { useSession } from "next-auth/react";

export function middleware(req) {
  const { data: session, status } = useSession();
  const url = req.nextUrl;

  // ===== Ambil data dari localStorage API-like cookies =====
  const cookies = req.cookies;
  const idAdmin = cookies.get("id_admin")?.value;      // perusahaan
  const role = cookies.get("alumni")?.value;          // mahasiswa
  const idSuper = cookies.get("id")?.value;      // admin sistem

  // -------------------------
  // **Proteksi PERUSAHAAN**
  // -------------------------
  if (url.pathname.startsWith("/dashboardPerusahaan")) {
    if (!idAdmin) {
      return NextResponse.redirect(new URL("/loginPerusahaan", req.url));
    }
  }

  // -------------------------
  // **Proteksi MAHASISWA**
  // -------------------------
  if (url.pathname.startsWith("/dashboardMHS")) {
    if (!role) {
      return NextResponse.redirect(new URL("/loginMhs", req.url));
    }
  }

  // -------------------------
  // **Proteksi SUPER ADMIN**
  // -------------------------
  if (url.pathname.startsWith("/dashboardAdmin")) {
    if (!idSuper) {
      return NextResponse.redirect(new URL("/loginPerusahaan", req.url));
    }
  }

  return NextResponse.next();
}

// Aktifkan middleware untuk semua route dashboard
export const config = {
  matcher: [
    "/dashboardPerusahaan/:path*",
    "/dashboardAdmin/:path*",
    "/dashboardMHS/:path*",
  ],
};
