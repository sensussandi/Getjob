"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar kiri */}
        <Sidebar />

        {/* Area kanan */}
        <div className="flex flex-col flex-1">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
