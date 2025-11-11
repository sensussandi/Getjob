"use client";
import { useState } from "react";

export default function RekomendasiPage() {
  const [prodi, setProdi] = useState("");
  const [keahlian, setKeahlian] = useState([]);
  const [error, setError] = useState("");

  // ✅ 26 Program Studi Universitas Sanata Dharma
  const daftarProdi = [
    "Informatika", "Teknik Elektro", "Fisika", "Matematika", "Biologi",
    "Farmasi", "Psikologi", "Ilmu Komunikasi", "Manajemen", "Akuntansi",
    "Ekonomi", "Pendidikan Bahasa Inggris", "Pendidikan Bahasa Indonesia",
    "Pendidikan Fisika", "Pendidikan Biologi", "Pendidikan Guru SD",
    "Bimbingan dan Konseling", "Arsitektur", "Sastra Inggris",
    "Sastra Indonesia", "Sastra Jerman", "Sastra Prancis",
    "Ilmu Hukum", "Keperawatan", "Teknik Mesin", "Teknik Sipil"
  ];

  // ✅ Lebih banyak keahlian & minat bakat
  const daftarKeahlian = [
    // Teknologi & IT
    "Web Developer", "UI/UX Designer", "Mobile Developer", "Game Developer",
    "Data Analyst", "Data Scientist", "Network Engineer", "Cyber Security",
    "AI Engineer", "DevOps Engineer",

    // Bisnis & Manajemen
    "Marketing", "Digital Marketing", "Sales", "Entrepreneurship",
    "Public Relations", "Customer Service", "Finance Analyst",
    "Human Resource", "Business Analyst",

    // Kreatif & Desain
    "Graphic Designer", "Video Editor", "Content Creator", "Copywriter",
    "Animator", "Photographer", "Brand Strategist", "Illustrator",

    // Pendidikan & Sosial
    "Guru SD", "Guru Bahasa Inggris", "Psikolog", "Konselor",
    "Peneliti", "Tutor Privat", "Penerjemah",

    // Teknik & Lapangan
    "Teknisi Listrik", "Teknisi Mesin", "Arsitek", "Drafter",
    "Quality Control", "Surveyor", "Operator Produksi",

    // Kesehatan
    "Perawat", "Apoteker", "Analis Kesehatan", "Laboran",

    // Umum
    "Admin Kantor", "Barista", "Kasir", "Event Organizer"
  ];

  const handleKeahlianChange = (skill) => {
    if (keahlian.includes(skill)) {
      setKeahlian(keahlian.filter((k) => k !== skill));
    } else if (keahlian.length < 5) {
      setKeahlian([...keahlian, skill]);
    } else {
      setError("Maksimal pilih 5 keahlian!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!prodi) {
      setError("Silakan pilih program studi terlebih dahulu!");
      return;
    }
    if (keahlian.length === 0) {
      setError("Pilih minimal satu keahlian!");
      return;
    }

    try {
      const res = await fetch("/api/pencari_kerja/updateprofil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prodi, keahlian }),
      });
      const result = await res.json();

      if (result.success) {
        alert("Data tersimpan! Menampilkan rekomendasi lowongan...");
        window.location.href = "/dashboardMHS/rekomendasi/hasil";
      } else {
        alert("Gagal menyimpan data!");
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan server!");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* === Sidebar Tetap di Kiri === */}
      <aside className="w-64 bg-gradient-to-b from-red-900 to-red-700 text-white fixed top-0 left-0 h-full shadow-xl flex flex-col">
        <div className="p-6 border-b border-red-800">
          <h1 className="text-2xl font-bold tracking-wide">GetJob</h1>
          <p className="text-sm text-red-200">Portal Karir Mahasiswa USD</p>
        </div>

        <nav className="flex-1 p-4 space-y-3">
          <a href="/dashboardMHS" className="block px-3 py-2 rounded-lg hover:bg-red-800 transition">
            Dashboard
          </a>
          <a href="/dashboardMHS/rekomendasi" className="block px-3 py-2 rounded-lg bg-red-800 font-semibold shadow">
            Rekomendasi Loker
          </a>
          <a href="/lamaran" className="block px-3 py-2 rounded-lg hover:bg-red-800 transition">
            Lamaran Saya
          </a>
          <a href="/statistik" className="block px-3 py-2 rounded-lg hover:bg-red-800 transition">
            Statistik
          </a>
          <a href="/profil" className="block px-3 py-2 rounded-lg hover:bg-red-800 transition">
            Profil
          </a>
          <a href="/pengaturan" className="block px-3 py-2 rounded-lg hover:bg-red-800 transition">
            Pengaturan
          </a>
        </nav>
      </aside>

      {/* === Konten Utama === */}
      <main className="flex-1 ml-64 p-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-red-900 mb-6 text-center">
            Isi Profil Rekomendasi Loker
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* === Prodi === */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                1. Apa program studi Anda?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {daftarProdi.map((item) => (
                  <label
                    key={item}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-900"
                  >
                    <input
                      type="radio"
                      name="prodi"
                      value={item}
                      checked={prodi === item}
                      onChange={() => setProdi(item)}
                      className="accent-red-800"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* === Keahlian === */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                2. Apa keahlian dan minat bakat Anda? <span className="text-sm text-gray-500">(maks. 5)</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {daftarKeahlian.map((item) => (
                  <label
                    key={item}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-900"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      checked={keahlian.includes(item)}
                      onChange={() => handleKeahlianChange(item)}
                      className="accent-red-800"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* === Error & Submit === */}
            {error && <p className="text-red-600 font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-900 to-red-700 hover:opacity-90 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition-all"
            >
              Simpan & Lihat Rekomendasi
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
