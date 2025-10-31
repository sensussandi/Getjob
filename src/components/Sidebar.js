"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home, Briefcase, User, Settings, LogOut, ChevronLeft, ChevronRight,
  BookOpen, BarChart3
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [userName, setUserName] = useState("Memuat...");
  const [userRole, setUserRole] = useState("Mahasiswa");

  // ✅ Ambil nama user dari backend berdasarkan email di localStorage
  useEffect(() => {
    const fetchUserData = async () => {
<<<<<<< HEAD
      const user = localStorage.getItem("user");
      if (!user) {
=======
      const userEmail = localStorage.getItem("user");
      if (!userEmail) {
>>>>>>> 6360268fc73422eb9344a79b9837d72178381660
        console.warn("Email tidak ditemukan, redirect ke login...");
        router.push("/loginMhs");
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/users/email/${user}`);
        const result = await res.json();

        if (result.success && result.data) {
          setUserName(result.data.nama_lengkap || "Mahasiswa");
        } else {
          setUserName("Mahasiswa");
        }
      } catch (err) {
        console.error("Gagal memuat data user:", err);
        setUserName("Mahasiswa");
      }
    };

    fetchUserData();
  }, [router]);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Anda telah logout!");
    router.push("/"); // kembali ke halaman utama
  };

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", href: "/dashboardMHS", badge: null },
    { id: "loker", icon: Briefcase, label: "Rekomendasi Loker", href: "/loker", badge: "12" },
    { id: "lamaran", icon: BookOpen, label: "Lamaran Saya", href: "/lamaran", badge: "3" },
    { id: "statistik", icon: BarChart3, label: "Statistik", href: "/statistik", badge: null },
    { id: "profil", icon: User, label: "Profil", href: "/profil", badge: null },
    { id: "pengaturan", icon: Settings, label: "Pengaturan", href: "/pengaturan", badge: null },
  ];

  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-64"
        } bg-white border-r border-slate-200 p-4 flex flex-col transition-all duration-300 ease-in-out shadow-sm relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-colors shadow-md z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Logo Section */}
      <div className={`mb-8 ${isCollapsed ? "px-0" : "px-2"}`}>
        {isCollapsed ? (
          <div className="w-12 h-12 bg-gradient-to-br from-red-900 to-red-700 rounded-xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">G</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="h-12 w-12 rounded-xl object-cover shadow-md"
            />
            <div>
              <h1 className="font-bold text-gray-900 text-lg">GetJob</h1>
              <p className="text-xs text-gray-500">Portal Karir</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveMenu(item.id)}
              className={`
                group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                ${isActive
                  ? "bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg shadow-red-900/20"
                  : "text-gray-700 hover:bg-slate-50 hover:text-red-900"}
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              {/* Active Indicator */}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}

              {/* Icon */}
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-red-900"
                  } transition`}
              />

              {/* Label */}
              {!isCollapsed && (
                <span className="font-medium text-sm flex-1">{item.label}</span>
              )}

              {/* Badge */}
              {!isCollapsed && item.badge && (
                <span
                  className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${isActive
                      ? "bg-white/20 text-white"
                      : "bg-red-100 text-red-900"}
                  `}
                >
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                  {item.badge && (
                    <span className="ml-2 px-1.5 py-0.5 bg-red-500 rounded-full text-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </a>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-slate-200 my-4"></div>

      {/* User Info Card */}
      {!isCollapsed && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-900 to-red-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate">{userRole}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg transition text-sm font-medium flex items-center justify-center gap-2 border border-slate-200"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      )}

      {/* Logout for collapsed state */}
      {isCollapsed && (
        <button
          onClick={handleLogout}
          className="group relative flex items-center justify-center px-3 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-900 transition"
        >
          <LogOut className="w-5 h-5" />
          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
            Keluar
          </div>
        </button>
      )}
    </aside>
  );
}
