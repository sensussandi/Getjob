"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home, Briefcase, User, Settings, LogOut, ChevronLeft, ChevronRight,
  BookOpen, BarChart3
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [userName, setUserName] = useState("Memuat...");
  const [userRole, setUserRole] = useState("pencari_kerja");

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user?.nim) {
      router.push("/loginMhs");
      return;
    }

    setUserName(session.user.name || "Mahasiswa");
  }, [session, status]);

  // 🔥 FIX ACTIVE MENU BERDASARKAN URL
  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/dashboardMHS/rekomendasi")) {
      setActiveMenu("loker");
    } else if (pathname.startsWith("/dashboardMHS")) {
      setActiveMenu("dashboard");
    } else if (pathname.startsWith("/lamaran")) {
      setActiveMenu("lamaran");
    } else if (pathname.startsWith("/statistik")) {
      setActiveMenu("statistik");
    } else if (pathname.startsWith("/profil")) {
      setActiveMenu("profil");
    } else if (pathname.startsWith("/pengaturan")) {
      setActiveMenu("pengaturan");
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Anda telah logout!");
    router.push("/");
  };

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", href: "/dashboardMHS" },
    { id: "loker", icon: Briefcase, label: "Rekomendasi Loker", href: "/dashboardMHS/rekomendasi" },
    { id: "lamaran", icon: BookOpen, label: "Lamaran Saya", href: "/lamaran" },
    { id: "statistik", icon: BarChart3, label: "Statistik", href: "/statistik" },
    { id: "profil", icon: User, label: "Profil", href: "/profil" },
    { id: "pengaturan", icon: Settings, label: "Pengaturan", href: "/pengaturan" },
  ];

  return (
    <aside className={`${isCollapsed ? "w-20" : "w-64"} bg-white border-r border-slate-200 p-4 flex flex-col transition-all duration-300 ease-in-out shadow-sm relative`}>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border rounded-full flex items-center justify-center shadow-md"
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <div className={`mb-8 ${isCollapsed ? "px-0" : "px-2"}`}>
        {/* logo */}
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setActiveMenu(item.id)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all 
                ${isActive ? "bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg" : "text-gray-700 hover:bg-slate-50 hover:text-red-900"} 
                ${isCollapsed ? "justify-center" : ""}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-900 to-red-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userRole}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="mt-3 w-full border px-3 py-2 rounded-lg text-sm">
            <LogOut className="w-4 h-4 inline-block mr-2" /> Keluar
          </button>
        </div>
      )}
    </aside>
  );
}
