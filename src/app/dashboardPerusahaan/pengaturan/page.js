"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Upload, Building2, FileText, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PengaturanPage() {
  const router = useRouter();

  // State untuk data perusahaan
  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    tentang: "",
    alamat: "",
    logo: null,
    logoPreview: "",
  });

  // Ambil data perusahaan (bisa dari API kamu)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/perusahaan/pengaturan");
        const result = await res.json();
        if (result.success) {
          setFormData({
            nama_perusahaan: result.data.nama_perusahaan || "",
            tentang: result.data.tentang || "",
            alamat: result.data.alamat_perusahaan || "",
            logoPreview: result.data.logo_url || "",
            logo: null,
          });
        }
      } catch (err) {
        console.error("Gagal memuat data perusahaan:", err);
      }
    };
    fetchData();
  }, []);

  // Fungsi saat input berubah
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({
        ...formData,
        [name]: files[0],
        logoPreview: URL.createObjectURL(files[0]),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fungsi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nama_perusahaan", formData.nama_perusahaan);
    data.append("tentang", formData.tentang);
    data.append("alamat", formData.alamat);
    if (formData.logo) data.append("logo", formData.logo);

    try {
      const res = await fetch("/api/perusahaan/pengaturan", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        alert("Profil perusahaan berhasil diperbarui!");
        router.push("/dashboardPerusahaan");
      } else {
        alert("Gagal memperbarui profil perusahaan!");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-10 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Pengaturan Perusahaan
            </h1>
          </div>
        </div>

        {/* Form Pengaturan */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo Perusahaan */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
                {formData.logoPreview ? (
                  <img
                    src={formData.logoPreview}
                    alt="Logo Perusahaan"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <label
                  htmlFor="logo"
                  className="cursor-pointer flex items-center gap-2 text-sm font-medium text-[#800000] hover:underline"
                >
                  <Upload className="w-4 h-4" />
                  Unggah Logo Baru
                </label>
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: JPG, PNG — Max 2MB
                </p>
              </div>
            </div>

            {/* Nama Perusahaan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Perusahaan
              </label>
              <input
                type="text"
                name="nama_perusahaan"
                value={formData.nama_perusahaan}
                onChange={handleChange}
                placeholder="Masukkan nama perusahaan"
                className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-[#800000] focus:border-[#800000]"
              />
            </div>

            {/* Tentang Perusahaan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tentang Perusahaan
              </label>
              <textarea
                name="tentang"
                value={formData.tentang}
                onChange={handleChange}
                rows="4"
                placeholder="Tuliskan deskripsi singkat tentang perusahaan..."
                className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-[#800000] focus:border-[#800000]"
              ></textarea>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Perusahaan
              </label>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-2" />
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Masukkan alamat lengkap perusahaan"
                  className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-[#800000] focus:border-[#800000]"
                ></textarea>
              </div>
            </div>

            {/* Tombol Simpan+logout */}
            {/* Tombol Simpan + Logout */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Apakah Anda yakin ingin logout?")) {
                    // 🔹 Hapus data login (ubah sesuai yang kamu simpan di localStorage)
                    localStorage.removeItem("id_admin");
                    localStorage.removeItem("nama_perusahaan");
                    localStorage.removeItem("token");

                    alert("Anda telah logout.");
                    router.push("/loginPerusahaan");
                  }
                }}
                className="px-6 py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all"
              >
                Logout
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#800000] to-[#b22222] text-white rounded-lg font-semibold hover:opacity-90"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
