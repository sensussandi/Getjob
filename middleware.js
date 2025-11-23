import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  // ===== Ambil data dari localStorage API-like cookies =====
  const cookies = req.cookies;
  const idAdmin = cookies.get("id_admin")?.value;      // perusahaan
  const idMhs = cookies.get("id_mhs")?.value;          // mahasiswa
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
    if (!idMhs) {
      return NextResponse.redirect(new URL("/loginMHS", req.url));
    }
  }

  // -------------------------
  // **Proteksi SUPER ADMIN**
  // -------------------------
  if (url.pathname.startsWith("/dashboardAdmin")) {
    if (!idSuper) {
      return NextResponse.redirect(new URL("/loginAdmin", req.url));
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
