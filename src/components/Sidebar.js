"use client";
import usePencakerAuth from "@/hooks/usePencakerAuth";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home, Briefcase, User, Settings, LogOut, ChevronLeft, ChevronRight,
  BookOpen, BarChart3
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  usePencakerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState(null);
  const { data: session, status } = useSession();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false); // button logout
  const [userName, setUserName] = useState("Memuat...");
  const [userRole, setUserRole] = useState("pencari_kerja");



  // 🔥 FIX ACTIVE MENU BERDASARKAN URL
  useEffect(() => {
    if (!session || session.user.role !== "alumni") return;
    const fetchData = async () => {
      const res = await fetch(`/api/pencari_kerja?nim=${session.user.id}`);
      
      const result = await res.json();

      if (result.success) {
        setData(result);  
      }
    };
    if (!pathname) return;

    if (pathname.startsWith("/dashboardMHS/rekomendasi")) {
      setActiveMenu("loker");
    } else if (pathname.startsWith("/dashboardMHS")) {
      setActiveMenu("dashboard");
    } else if (pathname.startsWith("/lamaran")) {
      setActiveMenu("lamaran");
    } else if (pathname.startsWith("/statistik")) {
      setActiveMenu("statistik");
    } else if (pathname.startsWith("/lihatLokerSaya")) {
      setActiveMenu("lihatLokerSaya");
    } else if (pathname.startsWith("/pengaturan")) {
      setActiveMenu("pengaturan");
    }
    fetchData();
  }, [session]);

  const user = session?.user;
  console.log("user", user)

  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: "/loginMhs",
    });
  };

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", href: "/dashboardMHS" },
    { id: "loker", icon: Briefcase, label: "Rekomendasi Loker", href: "/dashboardMHS/rekomendasi" },
    { id: "lihatLokerSaya", icon: BookOpen, label: "Lihat Loker Saya", href: "/lihatLokerSaya"},
    { id: "edit_profile", icon: Settings, label: "Edit Profile", href: "/editProfileMHS", badge: null },
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

          {/* === TOMBOL LOGOUT === */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-5 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center gap-2"
          >
            <span>Logout</span>
          </button>
          {showLogoutModal && (
            <div className="fixed inset-0 /40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-[340px]">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Konfirmasi Logout</h3>
                <p className="text-gray-600 mb-5">Apakah Anda yakin ingin logout dari akun ini?</p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 text-black rounded-lg border border-gray-300 hover:bg-red-100"
                  >
                    Batal
                  </button>

                  <button
                    onClick={() => {
                      setShowLogoutModal(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Ya, Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
