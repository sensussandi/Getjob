"use client";
import usePencakerAuth from "@/hooks/usePencakerAuth";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RekomendasiPage() {
  usePencakerAuth();
  const [prodi, setProdi] = useState("");
  const [keahlian, setKeahlian] = useState([]);
  const [error, setError] = useState("");

  // ⬅ ambil session paling atas
  const { data: session, status } = useSession();

  // ⬅ fetch data setelah session siap
  useEffect(() => {
    if (!session || session.user.role !== "nim") return;

    const fetchData = async () => {
      const res = await fetch(`/api/perusahaan/dashboard?nim=${session.user.nim}`);

      const result = await res.json();

      if (result.success) {
        setData(result);
      } else {
        console.error(result.message);
      }
    };

    fetchData();
  }, [session]);
  // === 26 Prodi USD ===
  const daftarProdi = [
    "Informatika", "Teknik Elektro", "Fisika", "Matematika", "Biologi",
    "Farmasi", "Psikologi", "Ilmu Komunikasi", "Manajemen", "Akuntansi",
    "Ekonomi", "Pendidikan Bahasa Inggris", "Pendidikan Bahasa Indonesia",
    "Pendidikan Fisika", "Pendidikan Biologi", "Pendidikan Guru SD",
    "Bimbingan dan Konseling", "Arsitektur", "Sastra Inggris",
    "Sastra Indonesia", "Sastra Jerman", "Sastra Prancis",
    "Ilmu Hukum", "Keperawatan", "Teknik Mesin", "Teknik Sipil"
  ];

  // === Keahlian & Minat Lengkap ===
  const daftarKeahlian = [
    // IT
    "Web Developer", "Mobile Developer", "UI/UX Designer", "Data Analyst",
    "Data Scientist", "Game Developer", "Cyber Security", "AI Engineer", "DevOps Engineer",
    // Bisnis & Manajemen
    "Marketing", "Digital Marketing", "Sales", "Public Relations", "Business Analyst",
    "Finance Analyst", "Entrepreneurship", "Human Resource", "Customer Service",
    // Kreatif
    "Graphic Designer", "Video Editor", "Content Creator", "Copywriter", "Photographer",
    "Animator", "Brand Strategist", "Illustrator",
    // Pendidikan & Sosial
    "Guru SD", "Guru Bahasa Inggris", "Tutor Privat", "Psikolog", "Konselor", "Peneliti",
    "Penerjemah", "Trainer", "Instruktur",
    // Teknik
    "Teknisi Listrik", "Teknisi Mesin", "Arsitek", "Drafter", "Quality Control",
    "Surveyor", "Operator Produksi", "Project Engineer",
    // Kesehatan
    "Perawat", "Apoteker", "Analis Kesehatan", "Laboran",
    // Umum
    "Admin Kantor", "Barista", "Kasir", "Event Organizer", "Customer Support"
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
    <div className="flex min-h-screen bg-gray-50">
      {/* === Konten utama (biar tidak menimpa sidebar) === */}
      <main className="flex-1 ml-64 p-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-red-900 mb-6 text-center">
            Isi Profil Rekomendasi Loker
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* === Prodi === */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                1. Apa program studi Anda?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {daftarProdi.map((item) => (
                  <label
                    key={item}
                    className="flex items-center space-x-2 text-gray-800 hover:text-red-900 transition"
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
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                2. Apa keahlian dan minat bakat Anda?{" "}
                <span className="text-sm text-gray-500">(maks. 5)</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {daftarKeahlian.map((item) => (
                  <label
                    key={item}
                    className="flex items-center space-x-2 text-gray-800 hover:text-red-900 transition"
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
