import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar kiri */}
      <Sidebar />

      {/* Area kanan */}
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
