"use client";
import {
  MapPin,
  CalendarDays,
  DollarSign,
  Building2,
  Briefcase,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";

// Fungsi untuk format tanggal Indonesia 
function formatTanggal(tanggal) {
  if (!tanggal) return "-";
  try {
    const date = new Date(tanggal);
    if (isNaN(date)) return tanggal;

    // Konversi ke WIB (+7 jam)
    const localDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    // Format ke bahasa Indonesia
    return localDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (e) {
    return tanggal;
  }
}
export default function LowonganTerbaru() {
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowongan = async () => {
      try {
        const res = await fetch("/api/lowongan");
        const data = await res.json();
        if (data.success) {
          setLowongan(data.data);
        }
      } catch (err) {
        console.error("Gagal memuat lowongan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLowongan();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#800000] rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Lowongan Terbaru
            </h2>
          </div>
          <p className="text-gray-600 ml-14">
            Temukan peluang karir terbaik dari perusahaan-perusahaan terpercaya
          </p>
        </div>

        {lowongan.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">
              Belum ada lowongan tersedia saat ini.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Cek kembali nanti untuk peluang baru
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lowongan.map((job) => (
              <div
                key={job.id_lowongan}
                className="bg-white rounded-2xl border border-gray-200 hover:border-[#800000]/30 hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Company Header with Gradient */}
                <div className="bg-gradient-                  -r from-[#800000] to-[#b22222] p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-[#800000]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">
                        {job.nama_perusahaan || "Nama Perusahaan"}
                      </h4>
                      <p className="text-white/80 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.lokasi}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Job Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#800000] transition-colors line-clamp-2">
                    {job.nama_posisi}
                  </h3>

                  {/* Job Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {job.deskripsi_pekerjaan}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs bg-[#fff1f1] text-[#800000] px-3 py-1.5 rounded-lg font-semibold">
                      {job.tipe_pekerjaan || "Full Time"}
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium">
                      {job.tingkat_pengalaman || "Entry Level"}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-4"></div>

                  {/* Footer Info */}
                  <div className="space-y-2.5">
                    {/* Salary */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {job.gaji}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-gray-600">
                        Tutup:{" "}
                        <span className="font-medium text-gray-700">
                          {formatTanggal(job.tanggal_ditutup)}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Apply Button */}
                  {job.external_url ? (
                    <a
                      href={job.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-5 bg-[#800000] hover:bg-[#5c0000] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all group-hover:shadow-lg"
                    >
                      <span>Lamar Sekarang</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : (
                    <a
                      href={`/lowongan/${job.id_lowongan}`}
                      className="w-full mt-5 bg-[#800000] hover:bg-[#5c0000] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all group-hover:shadow-lg"
                    >
                      <span>Lamar Sekarang</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {lowongan.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white border-2 border-[#800000] text-[#800000] rounded-xl font-semibold hover:bg-[#800000] hover:text-white transition-all flex items-center gap-2 mx-auto group">
              <span>Lihat Semua Lowongan</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
