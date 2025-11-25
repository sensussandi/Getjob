"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import {
  Home, Briefcase, User, Settings, LogOut,
  ChevronLeft, ChevronRight, BookOpen
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const user = session?.user;

  // Redirect jika belum login
  useEffect(() => {
    if (status === "unauthenticated") router.push("/loginMhs");
  }, [status, router]);

  if (status === "loading") {
    return (
      <aside className="w-64 flex items-center justify-center p-6">
        <p className="text-red-900">Memuat...</p>
      </aside>
    );
  }

  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-64"}
      bg-white border-r border-slate-200 p-4 flex flex-col transition-all duration-300 shadow-sm relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border rounded-full shadow-md flex items-center justify-center"
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      {/* Logo */}
      <div className={`mb-8 ${isCollapsed ? "px-0" : "px-2"}`}>
        {isCollapsed ? (
          <div className="w-12 h-12 bg-red-800 rounded-xl mx-auto"></div>
        ) : (
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" className="w-12 h-12 rounded-xl shadow-md" />
            <div>
              <h1 className="font-bold text-gray-900 text-lg">GetJob</h1>
              <p className="text-xs text-gray-500">Portal Karir</p>
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="space-y-1 flex-1">
        <MenuItem
          href="/dashboardMHS"
          icon={Home}
          active={activeMenu === "dashboard"}
          collapsed={isCollapsed}
          onClick={() => setActiveMenu("dashboard")}
          label="Dashboard"
        />

        <MenuItem
          href="/Rekomendasi"
          icon={Briefcase}
          active={activeMenu === "Rekomendasi"}
          collapsed={isCollapsed}
          badge="12"
          onClick={() => setActiveMenu("Rekomendasi")}
          label="Rekomendasi Loker"
        />

        <MenuItem
          href="/lihatLokerSaya"
          icon={BookOpen}
          active={activeMenu === "lihat_loker_saya"}
          collapsed={isCollapsed}
          badge="3"
          onClick={() => setActiveMenu("lihat_loker_saya")}
          label="Lamaran Saya"
        />

        <MenuItem
          href="/editProfileMHS"
          icon={Settings}
          active={activeMenu === "edit_profile"}
          collapsed={isCollapsed}
          onClick={() => setActiveMenu("edit_profile")}
          label="Edit Profile"
        />
      </nav>

      {/* User Box */}
      {!isCollapsed && user && (
        <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center">
              <User className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.nama_lengkap}</p>
              <p className="text-xs text-gray-500">{user.prodi || "Mahasiswa"}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/loginMhs" })}
            className="w-full py-2 bg-white border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      )}
    </aside>
  );
}

/** Component menu item */
function MenuItem({ href, icon: Icon, label, active, collapsed, badge, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 px-3 py-3 rounded-xl relative
        ${active ? "bg-red-800 text-white" : "text-gray-700 hover:bg-gray-100"}
        ${collapsed ? "justify-center" : ""}`}
    >
      <Icon className={`w-5 h-5`} />
      {!collapsed && <span>{label}</span>}
      {!collapsed && badge && (
        <span className="px-2 py-1 text-xs bg-red-100 text-red-900 rounded-full ml-auto">
          {badge}
        </span>
      )}
    </a>
  );
}