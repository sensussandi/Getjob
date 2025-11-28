"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase, MapPin, Building2, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import usePencakerAuth from "@/hooks/usePencakerAuth";

export default function HasilCariKerja() {
  usePencakerAuth();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const lokasi = searchParams.get("lokasi") || "";
  const kategori = searchParams.get("kategori") || "";
  const [lowongan, setLowongan] = useState(null);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || session.user.role !== "alumni") return;
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/lowongan?nim=${session.user.id}`);
        const data = await res.json();
        
        setLowongan(data.lowongan || []);
      } catch (err) {
        console.error("Gagal cari loker:", err);
        setError("Terjadi kesalahan saat cari loker.");
      } finally {
        setLoading(false);
      }   
    };

    fetchDetail();
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (lokasi) params.append("lokasi", lokasi);
      if (kategori) params.append("kategori", kategori);

      const res = await fetch(`/api/cariLowongan?${params.toString()}`);
      const result = await res.json();

      if (result.success) setData(result.data);
      setLoading(false);
    };

    fetchData();
  }, [keyword, lokasi, kategori]);
  console.log("data", session);
  if (loading) return <div className="text-center py-20 text-gray-600">Memuat hasil pencarian...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        {/* Judul + Informasi filter */}
        <button onClick={() => history.back()} className="mb-6 text-red-800 hover:text-red-600 flex items-center gap-1">
          <ArrowLeft size={18} /> Kembali
        </button>

        <h1 className="text-3xl font-bold text-center text-red-900 mb-2">Hasil Pencarian Lowongan</h1>

        <p className="text-center text-gray-600 mb-6">
          {keyword && (
            <span className="mr-3">
              🔍 <strong>{keyword}</strong>
            </span>
          )}
          {lokasi && lokasi !== "Semua Lokasi" && (
            <span className="mr-3">
              📍 <strong>{lokasi}</strong>
            </span>
          )}
          {kategori && kategori !== "Semua Pekerjaan" && (
            <span>
              💼 <strong>{kategori}</strong>
            </span>
          )}
        </p>

        {/* Jika tidak ada hasil */}
        {data.length === 0 ? (
          <p className="text-center py-20 text-gray-500 text-lg">Tidak ditemukan hasil pencarian.</p>
        ) : (
          <div className="space-y-6">
            {data.map((job) => (
              <div key={job.id_lowongan} className="p-6 bg-gradient-to-r from-white to-orange-50 rounded-2xl shadow-md border hover:shadow-lg transition cursor-pointer">
                {/* Nama & Perusahaan */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-red-900">{job.nama_posisi}</h2>
                  {job.logo_url && <img src={`/uploads/${job.logo_url}`} alt="Logo" className="w-12 h-12 object-cover rounded-xl border" />}
                </div>

                <p className="text-gray-700 flex items-center mt-2 gap-2">
                  <Building2 size={18} />
                  {job.nama_perusahaan}
                </p>

                {/* Info lokasi + gaji */}
                <div className="flex justify-between mt-4 text-gray-700 text-sm">
                  <p className="flex items-center gap-1">
                    <MapPin size={16} />
                    {job.lokasi}
                  </p>
                  <p className="flex items-center gap-1">
                    <Briefcase size={16} />
                    {job.tipe_pekerjaan || "Tidak ada kategori"}
                  </p>
                </div>

                <p className="mt-3 text-gray-700">
                  <strong>Gaji:</strong> {job.gaji || "Tidak disebutkan"}
                </p>

                {/* Tombol detail */}
                <div className="text-right mt-4">
                  <a href={`/lowongan/${job.id_lowongan}`} className="text-red-800 hover:text-red-600 text-sm font-semibold underline">
                    Lihat Detail →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
