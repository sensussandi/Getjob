"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ArrowLeft, FileSpreadsheet, FileDown, Search, Filter } from "lucide-react";

function genderLabel(g) {
  return g === "1" || g === 1 ? "Laki-laki" : "Perempuan";
}

function formatTanggalIndo(tanggal) {
  if (!tanggal) return "-";

  const date = new Date(tanggal);

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function SemuaPelamar() {
  const router = useRouter();
  const { data: session } = useSession();

  const [pelamar, setPelamar] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  // fetch data
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      const res = await fetch(
        `/api/perusahaan/semuaPelamar?id_admin=${session.user.id}`
      );
      const data = await res.json();

      if (data.success) setPelamar(data.data);
      setLoading(false);
    };

    fetchData();
  }, [session]);

  // filtering & search
  const filteredData = pelamar.filter((p) => {
    const q = searchQuery.toLowerCase();

    const matchSearch =
      p.nama_lengkap.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.nim.toLowerCase().includes(q) ||
      p.prodi.toLowerCase().includes(q) ||
      p.nama_posisi.toLowerCase().includes(q);

    const matchStatus =
      filterStatus === "semua" ? true : p.status_pendaftaran === filterStatus;

    return matchSearch && matchStatus;
  });

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  // update status
  const updateStatus = async (id, status) => {
    const res = await fetch("/api/perusahaan/updateStatus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_pendaftaran: id, status }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Status diperbarui!");

      setPelamar((prev) =>
        prev.map((item) =>
          item.id_pendaftaran === id
            ? { ...item, status_pendaftaran: status }
            : item
        )
      );
    } else {
      alert("Gagal memperbarui status!");
    }
  };

  // export excel
  const exportExcel = () => {
    const filename = prompt("Masukkan nama file Excel:", "data_pelamar");
    if (!filename) return;

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pelamar");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  // export pdf
  const exportPDF = () => {
    const filename = prompt("Masukkan nama file PDF:", "data_pelamar");
    if (!filename) return;

    const doc = new jsPDF({ orientation: "landscape" });

    doc.text("Data Semua Pelamar", 14, 16);

    const tableData = filteredData.map((p) => [
      p.nim,
      p.nama_lengkap,
      p.tanggal_lahir,
      p.jenis_kelamin,
      p.alamat,
      p.email,
      p.no_telephone,
      p.pendidikan_terakhir,
      p.prodi,
      p.linkedin,
      p.keahlian,
      p.tentang_anda,
      p.cv ? p.cv : "-",
      p.nama_posisi,
      p.tanggal_daftar,
      p.status_pendaftaran,
    ]);

    autoTable(doc, {
      head: [
        [
          "NIM",
          "Nama",
          "Tgl Lahir",
          "JK",
          "Alamat",
          "Email",
          "Telepon",
          "Pendidikan",
          "Prodi",
          "LinkedIn",
          "Keahlian",
          "Tentang Anda",
          "CV",
          "Posisi",
          "Tgl Daftar",
          "Status",
        ],
      ],
      body: tableData,
      startY: 22,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [128, 0, 0] },
    });

    doc.save(`${filename}.pdf`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#800000] to-[#5c0000]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-semibold">Memuat data...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#800000] hover:text-[#5c0000] mb-6 font-semibold transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" /> 
          Kembali
        </button>

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#800000] to-[#a00000] rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Data Semua Pelamar</h1>
              <p className="text-gray-200 text-sm">Total: {filteredData.length} pelamar</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportExcel}
                className="px-5 py-2.5 bg-white text-[#800000] hover:bg-gray-100 rounded-lg flex items-center gap-2 font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export Excel
              </button>

              <button
                onClick={exportPDF}
                className="px-5 py-2.5 bg-white text-[#800000] hover:bg-gray-100 rounded-lg flex items-center gap-2 font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <FileDown className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, email, NIM, prodi, posisi..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            <div className="relative md:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent outline-none appearance-none cursor-pointer transition-all duration-200"
              >
                <option value="semua">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="diterima">Diterima</option>
                <option value="tidak">Ditolak</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-[#800000] to-[#a00000] text-white">
                <tr>
                  <th className="px-4 py-4 font-semibold">NIM</th>
                  <th className="px-4 py-4 font-semibold">Nama Lengkap</th>
                  <th className="px-4 py-4 font-semibold">Tanggal Lahir</th>
                  <th className="px-4 py-4 font-semibold">Jenis Kelamin</th>
                  <th className="px-4 py-4 font-semibold">Alamat</th>
                  <th className="px-4 py-4 font-semibold">Email</th>
                  <th className="px-4 py-4 font-semibold">Telepon</th>
                  <th className="px-4 py-4 font-semibold">Pendidikan</th>
                  <th className="px-4 py-4 font-semibold">Prodi</th>
                  <th className="px-4 py-4 font-semibold">LinkedIn</th>
                  <th className="px-4 py-4 font-semibold">Keahlian</th>
                  <th className="px-4 py-4 font-semibold">Tentang Anda</th>
                  <th className="px-4 py-4 font-semibold">CV</th>
                  <th className="px-4 py-4 font-semibold">Posisi Dilamar</th>
                  <th className="px-4 py-4 font-semibold">Tanggal Daftar</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="17" className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-12 h-12 text-gray-300" />
                        <p className="font-semibold">Tidak ada data ditemukan</p>
                        <p className="text-sm">Coba ubah kata kunci pencarian atau filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((p, idx) => (
                    <tr
                      key={p.id_pendaftaran}
                      className={`hover:bg-[#fff5f5] transition-colors duration-150 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{p.nim}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.nama_lengkap}</td>
                      <td className="px-4 py-3 text-gray-600">{formatTanggalIndo(p.tanggal_lahir)}</td>
                      <td className="px-4 py-3 text-gray-600">{genderLabel(p.jenis_kelamin)}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={p.alamat}>{p.alamat}</td>
                      <td className="px-4 py-3 text-gray-600">{p.email}</td>
                      <td className="px-4 py-3 text-gray-600">{p.no_telephone}</td>
                      <td className="px-4 py-3 text-gray-600">{p.pendidikan_terakhir}</td>
                      <td className="px-4 py-3 text-gray-600">{p.prodi}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {p.linkedin ? (
                          <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#800000] hover:underline">
                            LinkedIn
                          </a>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={p.keahlian}>{p.keahlian}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={p.tentang_anda}>{p.tentang_anda}</td>

                      {/* DOWNLOAD CV */}
                      <td className="px-4 py-3">
                        {p.cv ? (
                          <a
                            href={`/uploads/cv/${p.cv}`}
                            download
                            target="_blank"
                            className="text-[#800000] hover:text-[#5c0000] font-medium hover:underline transition-colors duration-200"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">Tidak ada</span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-medium text-gray-900">{p.nama_posisi}</td>
                      <td className="px-4 py-3 text-gray-600">{formatTanggalIndo(p.tanggal_daftar)}</td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        {p.status_pendaftaran === "menunggu" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            Menunggu
                          </span>
                        )}
                        {p.status_pendaftaran === "diterima" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Diterima
                          </span>
                        )}
                        {p.status_pendaftaran === "tidak" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            Ditolak
                          </span>
                        )}
                      </td>

                      {/* AKSI */}
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(p.id_pendaftaran, "diterima")}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={p.status_pendaftaran !== "menunggu"}
                          >
                            Terima
                          </button>

                          <button
                            onClick={() => updateStatus(p.id_pendaftaran, "tidak")}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            disabled={p.status_pendaftaran !== "menunggu"}
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-3">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-white border-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#800000] transition-all duration-200"
            >
              Previous
            </button>

            <span className="px-4 py-2.5 bg-[#800000] text-white rounded-lg font-semibold shadow-md">
              Halaman {currentPage} dari {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 bg-white border-2 border-[#800000] text-[#800000] hover:bg-[#800000] hover:text-white rounded-lg font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#800000] transition-all duration-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}