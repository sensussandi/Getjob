export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64">
        {/** Import Sidebar secara langsung */}
        {require("@/components/Sidebar").default()}
      </div>

      {/* Konten Halaman */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}