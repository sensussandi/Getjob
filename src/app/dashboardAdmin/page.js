"use client";
import { useEffect, useState } from "react";
import { Building2, Users, Briefcase, BarChart3, Plus, Eye, Trash2 } from "lucide-react";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    totalPerusahaan: 0,
    totalPencariKerja: 0,
    totalLowongan: 0,
  });

  const [dataPerusahaan, setDataPerusahaan] = useState([]);
  const [dataPencariKerja, setDataPencariKerja] = useState([]);
  const [dataLowongan, setDataLowongan] = useState([]);

  // Fetch data dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [perusahaan, pencaker, lowongan] = await Promise.all([
          fetch("http://localhost:5000/api/admin/perusahaan").then((r) => r.json()),
          fetch("http://localhost:5000/api/admin/pencaker").then((r) => r.json()),
          fetch("http://localhost:5000/api/admin/lowongan").then((r) => r.json()),
        ]);

        setDataPerusahaan(perusahaan);
        setDataPencariKerja(pencaker);
        setDataLowongan(lowongan);
        setStats({
          totalPerusahaan: perusahaan.length,
          totalPencariKerja: pencaker.length,
          totalLowongan: lowongan.length,
        });
      } catch (error) {
        console.error("Gagal memuat data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#800000] to-[#b22222] text-white p-8 rounded-2xl shadow-lg mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-white/80 mt-2">Pantau seluruh aktivitas sistem GetJob</p>
          </div>
          <div className="bg-white/20 px-5 py-2 rounded-xl text-sm backdrop-blur-sm">
            <BarChart3 className="inline w-5 h-5 mr-2" /> Statistik Sistem
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={<Building2 className="text-white w-6 h-6" />}
            title="Total Perusahaan"
            value={stats.totalPerusahaan}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<Users className="text-white w-6 h-6" />}
            title="Total Pencari Kerja"
            value={stats.totalPencariKerja}
            color="from-green-500 to-green-600"
          />
          <StatCard
            icon={<Briefcase className="text-white w-6 h-6" />}
            title="Total Lowongan Aktif"
            value={stats.totalLowongan}
            color="from-yellow-500 to-yellow-600"
          />
        </div>

        {/* Data Tabel */}
        <div className="space-y-10">
          <DataTable title="Data Perusahaan" data={dataPerusahaan} columns={["nama_perusahaan", "email_perusahaan", "no_telephone"]} />
          <DataTable title="Data Pencari Kerja" data={dataPencariKerja} columns={["nama_lengkap", "email", "prodi"]} />
          <DataTable title="Data Lowongan Kerja" data={dataLowongan} columns={["nama_posisi", "lokasi", "tanggal_ditutup"]} />
        </div>
      </div>
    </div>
  );
}

/* === KOMPONEN: Stat Card === */
function StatCard({ icon, title, value, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-lg text-white flex items-center justify-between`}>
      <div>
        <p className="text-white/80 text-sm">{title}</p>
        <h2 className="text-3xl font-bold">{value}</h2>
      </div>
      <div className="bg-white/30 p-3 rounded-full">{icon}</div>
    </div>
  );
}

/* === KOMPONEN: Data Table === */
function DataTable({ title, data, columns }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <button className="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#a00000] flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-3 text-left font-semibold uppercase tracking-wide text-gray-600">
                  {col.replace(/_/g, " ")}
                </th>
              ))}
              <th className="px-6 py-3 text-center font-semibold uppercase tracking-wide text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-6 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4">{row[col]}</td>
                  ))}
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
