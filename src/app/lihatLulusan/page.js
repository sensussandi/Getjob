"use client";

import { useState, useMemo } from 'react';
import LulusanTable from "@/components/LulusanTable";
import LulusanTerbaik from "@/components/LulusanTerbaik";
import { GraduationCap, Users, TrendingUp, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Page() {
  const allProdi = [
    "Informatika", "Sistem Informasi", "Teknik Komputer", "Manajemen Informatika",
    "Teknik Elektro", "Teknik Sipil", "Arsitektur", "Akuntansi",
    "Manajemen", "Ekonomi Pembangunan", "Hukum", "Ilmu Komunikasi",
    "Psikologi", "Kedokteran", "Farmasi", "Keperawatan",
    "Pendidikan Matematika", "Pendidikan Bahasa Inggris", "Agroteknologi", "Peternakan",
    "Desain Grafis", "Seni Rupa", "Teknik Industri", "Teknik Mesin",
    "Biologi", "Kimia"
  ];

  // Generate 100 data dummy untuk testing pagination
  const generateDummyData = () => {
    const names = [
      "Ahmad Rizki", "Siti Aisyah", "Budi Santoso", "Dewi Lestari", "Andi Prasetyo",
      "Nurul Hidayah", "Rizal Firmansyah", "Mega Sari", "Dimas Prakoso", "Rina Wulandari",
      "Fajar Ramadhan", "Indah Permata", "Yoga Pratama", "Laila Rahmawati", "Rudi Hermawan",
      "Sari Wijaya", "Eko Saputra", "Maya Anggraini", "Agus Setiawan", "Fitri Handayani"
    ];
    
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        nama: `${names[i % names.length]} ${i + 1}`,
        prodi: allProdi[Math.floor(Math.random() * allProdi.length)],
        tahun: 2022 + (i % 3),
        gender: i % 2 === 0 ? "Laki-laki" : "Perempuan",
        ipk: (3.50 + Math.random() * 0.50).toFixed(2)
      });
    }
    return data;
  };

  const dataLulusan = generateDummyData();

  const lulusanTerbaik = allProdi.map((prodi, idx) => ({
    nama: `Mahasiswa Terbaik ${idx + 1}`,
    prodi: prodi,
    ipk: (3.85 + Math.random() * 0.15).toFixed(2),
    tahun: 2023 + (idx % 2)
  }));

  const [filters, setFilters] = useState({
    tahun: 'Semua',
    prodi: 'Semua',
    gender: 'Semua',
    search: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const filteredData = useMemo(() => {
    return dataLulusan.filter(item => {
      const matchTahun = filters.tahun === 'Semua' || item.tahun.toString() === filters.tahun;
      const matchProdi = filters.prodi === 'Semua' || item.prodi === filters.prodi;
      const matchGender = filters.gender === 'Semua' || item.gender === filters.gender;
      const matchSearch = item.nama.toLowerCase().includes(filters.search.toLowerCase()) ||
                          item.prodi.toLowerCase().includes(filters.search.toLowerCase());
      return matchTahun && matchProdi && matchGender && matchSearch;
    });
  }, [filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filters]);

  const stats = useMemo(() => ({
    total: filteredData.length,
    avgIpk: filteredData.length > 0 
      ? (filteredData.reduce((sum, d) => sum + parseFloat(d.ipk), 0) / filteredData.length).toFixed(2)
      : '0.00'
  }), [filteredData]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 pt-24">
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#800000] via-[#a00000] to-[#800000] text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-12 h-12" />
                <h1 className="text-4xl md:text-5xl font-bold">Data Lulusan Mahasiswa</h1>
              </div>
              <p className="text-xl text-amber-100 max-w-2xl">
                Lihat lulusan terbaru dan lulusan terbaik dari setiap program studi
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Users className="w-6 h-6 mb-2" />
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm text-amber-100">Total Lulusan</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <TrendingUp className="w-6 h-6 mb-2" />
                <div className="text-3xl font-bold">{stats.avgIpk}</div>
                <div className="text-sm text-amber-100">Rata-rata IPK</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Filter Section */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-[#800000]/10 overflow-hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#800000] to-[#a00000] text-white hover:from-[#900000] hover:to-[#b00000] transition-all"
          >
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5" />
              <span className="font-semibold text-lg">Filter & Pencarian</span>
            </div>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {showFilters ? 'Sembunyikan' : 'Tampilkan'}
            </span>
          </button>
          
          {showFilters && (
            <div className="p-6 bg-gradient-to-br from-amber-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#800000] mb-2">
                    Tahun Lulus
                  </label>
                  <select
                    value={filters.tahun}
                    onChange={(e) => setFilters({...filters, tahun: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#800000]/20 focus:border-[#800000] focus:outline-none bg-white text-[#800000] font-medium"
                  >
                    <option>Semua</option>
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#800000] mb-2">
                    Program Studi
                  </label>
                  <select
                    value={filters.prodi}
                    onChange={(e) => setFilters({...filters, prodi: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#800000]/20 focus:border-[#800000] focus:outline-none bg-white text-[#800000] font-medium"
                  >
                    <option>Semua</option>
                    {allProdi.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#800000] mb-2">
                    Jenis Kelamin
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters({...filters, gender: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#800000]/20 focus:border-[#800000] focus:outline-none bg-white text-[#800000] font-medium"
                  >
                    <option>Semua</option>
                    <option>Laki-laki</option>
                    <option>Perempuan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-[#800000] mb-2">
                    Cari Nama
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#800000]/50" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters({...filters, search: e.target.value})}
                      placeholder="Ketik nama..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#800000]/20 focus:border-[#800000] focus:outline-none bg-white text-[#800000] font-medium placeholder:text-[#800000]/40"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#800000]/10">
                <div className="text-sm font-medium text-[#800000]">
                  Menampilkan <span className="font-bold text-lg">{Math.min(startIndex + 1, filteredData.length)}-{Math.min(endIndex, filteredData.length)}</span> dari <span className="font-bold">{filteredData.length}</span> lulusan
                </div>
                <button
                  onClick={() => setFilters({tahun: 'Semua', prodi: 'Semua', gender: 'Semua', search: ''})}
                  className="px-6 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#900000] transition-colors font-medium"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LulusanTable data={currentData} />
            
            {/* Pagination Controls */}
            {filteredData.length > itemsPerPage && (
              <div className="mt-6 bg-white rounded-2xl shadow-lg border border-[#800000]/10 p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      currentPage === 1
                        ? 'bg-[#800000]/20 text-[#800000]/40 cursor-not-allowed'
                        : 'bg-[#800000] text-white hover:bg-[#900000] hover:shadow-lg hover:-translate-x-1'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Sebelumnya
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-[#800000] font-medium">
                      Halaman
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg font-bold text-lg">
                        {currentPage}
                      </span>
                      <span className="text-[#800000] font-medium">
                        dari {totalPages}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                      currentPage === totalPages
                        ? 'bg-[#800000]/20 text-[#800000]/40 cursor-not-allowed'
                        : 'bg-[#800000] text-white hover:bg-[#900000] hover:shadow-lg hover:translate-x-1'
                    }`}
                  >
                    Selanjutnya
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <LulusanTerbaik data={lulusanTerbaik} />
        </div>
      </div>
    </div>
  );
}