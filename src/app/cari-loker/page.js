"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";

export default function CariLoker() {
  const [keyword, setKeyword] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [kategori, setKategori] = useState("");
  const [loker, setLoker] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data loker dari API
  const fetchLoker = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cari-loker");
      const data = await res.json();
      if (data.success) {
        setLoker(data.data);
      } else {
        setLoker([]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Load semua loker saat halaman dibuka
  useEffect(() => {
    fetchLoker();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#800000] via-[#900000] to-[#700000] text-white py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* === Header === */}
        <h1 className="text-center text-5xl font-extrabold mb-8">
          Cari <span className="text-yellow-400">Lowongan Pekerjaan</span>
        </h1>

        {/* === Form Pencarian === */}
        <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Input Kata Kunci */}
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg flex-1">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Kata kunci, posisi, atau perusahaan"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>

            {/* Input Lokasi */}
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg flex-1">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Cari lokasi"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>

            {/* Input Kategori */}
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg flex-1">
              <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Cari kategori"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Tombol */}
          <button
            onClick={fetchLoker}
            className="w-full mt-6 bg-[#c26b00] hover:bg-[#e68a00] text-white py-3 rounded-lg font-semibold transition-all"
          >
            🔍 Tampilkan Lowongan
          </button>
        </div>

        {/* === Daftar Lowongan === */}
        {loading ? (
          <p className="text-center text-yellow-300">Memuat data...</p>
        ) : loker.length === 0 ? (
          <p className="text-center text-red-200">
            Tidak ada lowongan yang ditemukan.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {loker.map((job) => (
              <div
                key={job.id_lowongan}
                className="bg-white text-gray-800 rounded-xl shadow-lg p-6 hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-xl font-bold text-[#800000] mb-1">
                  {job.nama_posisi}
                </h3>
                <p className="text-gray-700 font-semibold mb-1">
                  {job.nama_perusahaan}
                </p>
                <p className="text-gray-500 mb-2">
                  📍 {job.lokasi} | 💼 {job.kualifikasi}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {job.deskripsi_pekerjaan?.slice(0, 80)}...
                </p>
                <p className="font-semibold text-[#800000] mb-4">
                  💰 {job.gaji || "Negosiasi"}
                </p>
                <button className="w-full bg-[#800000] text-white py-2 rounded-lg font-semibold hover:bg-[#a00000] transition">
                  Lihat Detail
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
