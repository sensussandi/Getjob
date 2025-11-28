"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Info, Eye, Trash2 } from "lucide-react";

export default function PerusahaanPage({ params }) {
  const router = useRouter();
  const { page } = use(params); 
  const currentPage = Number(page) || 1;
  const itemsPerPage = 9;

  const [data, setData] = useState([]);
  const [totalPerusahaan, setTotalPerusahaan] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/admin/perusahaan");
      const result = await res.json();

      if (result.success) {
        setTotalPerusahaan(result.data.length);

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        setData(result.data.slice(start, end));
      }
    };
    fetchData();
  }, [currentPage]);

  // Total halaman
  const totalPages = Math.ceil(totalPerusahaan / itemsPerPage);

  const goToPage = (page) => {
    router.push(`/dashboardAdmin/perusahaan/page/${page}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Data Perusahaan</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.length === 0 ? (
          <p className="col-span-full text-gray-500">Tidak ada data</p>
        ) : (
          data.map((p) => (
            <div
              key={p.id_admin}
              className="bg-white border border-gray-200 rounded-xl hover:border-[#800000]/40 hover:shadow-lg transition-all p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {p.nama_perusahaan}
                  </h4>
                  <p className="text-sm text-gray-500">{p.nama_admin}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                  admin
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <p className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" /> {p.email_perusahaan}
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gray-400" /> {p.no_telepone}
                </p>
                <p className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-gray-400" /> {p.alamat_perusahaan}
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {p.tentang_perusahaan || "Belum ada deskripsi perusahaan."}
              </p>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  onClick={() =>
                    router.push(`/dashboardAdmin/perusahaan/kelola/${p.id_admin}`)
                  }
                  className="text-sm font-medium text-[#800000] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" /> kelola
                </button>

                <button className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1">
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-10">
        <button
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === 1
              ? "text-gray-400 border-gray-300"
              : "text-black border-gray-500 hover:bg-gray-100"
          }`}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === page
                  ? "bg-[#800000] text-white border-[#800000]"
                  : "border-gray-500 text-black hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300"
              : "text-black border-gray-500 hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
