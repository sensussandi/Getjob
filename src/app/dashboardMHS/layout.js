"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function Layout({ children }) {
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = localStorage.getItem("user");
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setCheckedAuth(true);
    }, 300); // 🕒 beri waktu render dulu sebelum cek auth

    return () => clearTimeout(timer);
  }, []);

  if (!checkedAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-red-900 font-semibold">
        Mengecek sesi login...
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.replace("/loginMhs");
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
