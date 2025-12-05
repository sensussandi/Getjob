"use client";
import usePencakerAuth from "@/hooks/usePencakerAuth";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Briefcase, Settings, ChevronLeft, ChevronRight, BookOpen, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar() {
  usePencakerAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [userName, setUserName] = useState("Memuat...");
  const [userRole, setUserRole] = useState("pencari_kerja");
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    if (!session || session.user.role !== "alumni") return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pencari_kerja?nim=${session.user.id}`);
        const result = await res.json();

        if (result.success) {
          const profile = result.data;
          setUserName(profile.nama || "Pengguna");
          setUserRole(profile.role || "pencari_kerja");
          setUserPhoto(profile.foto || null);
        }
      } catch (error) {
        console.error("Gagal load profil:", error);
      }
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/dashboardMHS/rekomendasi")) setActiveMenu("loker");
    else if (pathname.startsWith("/dashboardMHS")) setActiveMenu("dashboard");
    else if (pathname.startsWith("/lihatLokerSaya")) setActiveMenu("lihatLokerSaya");
    else if (pathname.startsWith("/editProfileMHS")) setActiveMenu("edit_profile");
  }, [pathname]);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", href: "/dashboardMHS" },
    { id: "loker", icon: Briefcase, label: "Rekomendasi Loker", href: "/dashboardMHS/rekomendasi" },
    { id: "lihatLokerSaya", icon: BookOpen, label: "Lihat Loker Saya", href: "/lihatLokerSaya" },
    { id: "edit_profile", icon: Settings, label: "Edit Profile", href: "/editProfileMHS" },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <aside className={`${isCollapsed ? "w-20" : "w-72"} bg-white border-r border-slate-200 p-5 flex flex-col transition-all duration-300 shadow-sm relative`}>
      <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-8 w-7 h-7 bg-white border rounded-full flex items-center justify-center shadow-md">
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      {/* MENU */}
      <nav className="flex-1 space-y-2 mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              className={`group flex items-center gap-4 px-4 py-4 rounded-xl transition-all cursor-pointer
                ${isActive ? "bg-gradient-to-r from-red-900 to-red-700 text-white shadow-lg" : "text-gray-700 hover:bg-slate-100 hover:text-red-800"}
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-500"}`} />
              {!isCollapsed && <span className="text-base font-medium">{item.label}</span>}
            </a>
          );
        })}
      </nav>

      {/* USER PROFILE */}
      <div className={`absolute bottom-4 left-4 right-4 ${isCollapsed ? "left-2 right-2" : ""}`}>
        <div className="bg-gray-50 rounded-xl p-5 border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {userPhoto ? <img src={userPhoto.startsWith("http") ? userPhoto : `/uploads/${userPhoto}`} className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-gray-500" />}
            </div>

            {!isCollapsed && (
              <div>
                <p className="font-semibold text-gray-900 text-base">{userName}</p>
                <p className="text-sm text-gray-500">{userRole}</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button onClick={() => setShowLogoutModal(true)} className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-2 text-base">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[350px]">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Konfirmasi Logout</h3>
            <p className="text-gray-600 mb-5">Apakah Anda yakin ingin logout?</p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium">
                Batal
              </button>

              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
