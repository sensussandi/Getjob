"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowLeft} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi field kosong
    for (const key in formData) {
      if (!formData[key]) {
        alert(`Field ${key.replace("_", " ")} wajib diisi!`);
        return;
      }
    }

    try {
      const res = await fetch("/api/admin/pencaker/tambah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        alert("Berhasil tambahkan akun! Silakan login.");
        window.location.href = "/loginMhs";
      } else {
        alert("Gagal mendaftar: " + result.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Terjadi kesalahan server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-700 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-red-900 mb-6">
          Daftarkan Akun Mahasiswa
        </h1>
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#800000]">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>

        <form onSubmit={handleSubmit} className="space-y-4 text-black">

          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-black">Email</label>
            <input
              type="text"
              name="email"
              value={formData.nama_lengkap}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black placeholder:text-gray"
              placeholder="Masukkan email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block font-medium mb-1 text-black">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black placeholder:text-gray"
              placeholder="Masukkan password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-600 hover:text-red-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            className="w-full bg-red-900 text-white py-3 rounded-lg hover:bg-red-800 font-semibold transition"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}
