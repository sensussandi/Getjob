"use client";
import useAdminAuth from "@/hooks/useAdminAuth";
import React, { useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PengaturanPage() {
  useAdminAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = localStorage.getItem("id"); // SUPER_ADMIN
    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    try {
      const res = await fetch(`/api/admin/pengaturan?id=${id}`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        alert("Berhasil diperbarui!");
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan. Coba lagi.");
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
              Pengaturan Super_admin
            </h1>
          </div>
        </div>

        {/* Form Pengaturan */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl text-black font-semibold mb-6">Perbarui Akun</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-[#800000] focus:border-[#800000] text-black "
              />
            </div>

            {/* password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-[#800000] focus:border-[#800000] text-black "
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
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
