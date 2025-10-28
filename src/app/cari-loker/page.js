"use client";
import { useState } from "react";
import { Search, MapPin, Briefcase, Building2 } from "lucide-react";

export default function CariLokerPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  // === Data Dummy Loker (nanti bisa diganti dengan fetch dari API) ===
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Innovate",
      location: "Yogyakarta",
      category: "IT & Software",
      type: "Full-time",
      salary: "Rp6.000.000 - Rp9.000.000",
    },
    {
      id: 2,
      title: "Graphic Designer",
      company: "Visual Arts Studio",
      location: "Bandung",
      category: "Design",
      type: "Part-time",
      salary: "Rp3.000.000 - Rp5.000.000",
    },
    {
      id: 3,
      title: "Marketing Specialist",
      company: "PromoMax Indonesia",
      location: "Jakarta",
      category: "Marketing",
      type: "Full-time",
      salary: "Rp5.500.000 - Rp8.000.000",
    },
    {
      id: 4,
      title: "Customer Support",
      company: "HelpMe ID",
      location: "Surabaya",
      category: "Customer Service",
      type: "Remote",
      salary: "Rp4.000.000 - Rp6.000.000",
    },
  ];

  // === Filter Data Berdasarkan Input User ===
  const filteredJobs = jobs.filter((job) => {
    const matchKeyword =
      keyword === "" ||
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(keyword.toLowerCase());
    const matchLocation =
      location === "" ||
      job.location.toLowerCase().includes(location.toLowerCase());
    const matchCategory =
      category === "" ||
      job.category.toLowerCase().includes(category.toLowerCase());
    return matchKeyword && matchLocation && matchCategory;
  });

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#800000] via-[#900000] to-[#700000] py-16 text-white">
      <div className="max-w-screen-xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          🔍 Cari <span className="text-yellow-400">Lowongan Pekerjaan</span>
        </h1>

        {/* === FORM PENCARIAN === */}
        <div className="bg-white text-gray-700 rounded-2xl shadow-2xl p-6 mb-12">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Kata Kunci */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Kata kunci, posisi, atau perusahaan"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
              />
            </div>

            {/* Lokasi */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari lokasi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
              />
            </div>

            {/* Kategori */}
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kategori"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Tombol Cari */}
          <button
            onClick={() => console.log("Search Clicked")}
            className="mt-6 w-full bg-gradient-to-r from-[#D26900] to-[#b45309] text-white py-3 rounded-xl font-bold text-lg hover:from-[#b45309] hover:to-[#D26900] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Tampilkan Lowongan
          </button>
        </div>

        {/* === HASIL LOWONGAN === */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white text-gray-800 rounded-xl shadow-lg hover:shadow-2xl p-6 transform hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-xl font-bold text-[#800000] mb-1">
                  {job.title}
                </h3>
                <p className="flex items-center gap-2 text-gray-600 mb-2">
                  <Building2 className="w-4 h-4 text-gray-500" /> {job.company}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#800000]" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-[#800000]" />
                    {job.category}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold text-[#800000]">
                    {job.type}
                  </span>{" "}
                  • {job.salary}
                </p>
                <button className="mt-3 w-full bg-[#800000] text-white py-2 rounded-lg hover:bg-[#a00000] transition">
                  Lihat Detail
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-200 col-span-full">
              Tidak ada lowongan yang cocok dengan pencarian kamu 😢
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
