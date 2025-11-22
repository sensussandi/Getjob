"use client";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nim: "",
    password: "",
    nama_lengkap: "", 
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    email: "",
    no_telephone: "",
    prodi: "",
    pendidikan_terakhir: "",
    linkedin: "",
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
        alert("Registrasi berhasil! Silakan login.");
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
          Registrasi Akun Mahasiswa
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIM */}
          <div>
            <label className="block font-medium mb-1">NIM</label>
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Masukkan NIM"
              required
            />
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block font-medium mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block font-medium mb-1">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block font-medium mb-1">Jenis Kelamin</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="1"
                  checked={formData.jenis_kelamin === "1"}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2">Laki-laki</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="2"
                  checked={formData.jenis_kelamin === "2"}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2">Perempuan</span>
              </label>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block font-medium mb-1">Alamat</label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Masukkan alamat lengkap"
              rows="3"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Masukkan email aktif"
              required
            />
          </div>

          {/* No Telepon */}
          <div>
            <label className="block font-medium mb-1">No Telepon</label>
            <input
              type="text"
              name="no_telephone"
              value={formData.no_telephone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Masukkan nomor telepon"
              required
            />
          </div>

          {/* Program Studi */}
          <div>
            <label className="block font-medium mb-1">Program Studi</label>
            <select
              name="prodi"
              value={formData.prodi}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Pilih Prodi</option>
              <option value="Informatika">Informatika</option>
              <option value="TM">Teknik Mesin</option>
              <option value="TE">Teknik Elektro</option>
              <option value="Matematika">Matematika</option>
            </select>
          </div>

          {/* Pendidikan Terakhir */}
          <div>
            <label className="block font-medium mb-1">Pendidikan Terakhir</label>
            <select
              name="pendidikan_terakhir"
              value={formData.pendidikan_terakhir}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Pilih Pendidikan</option>
              <option value="SDMI">SD / MI (Sekolah Dasar / Madrasah Ibtidaiyah)</option>
              <option value="SMPMTs">SMP / MTs (Sekolah Menengah Pertama / Madrasah Tsanawiyah)</option>
              <option value="SMAMA">SMA / MA (Sekolah Menengah Atas / Madrasah Aliyah)</option>
              <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
              <option value="D1">D1 (Diploma 1)</option>
              <option value="D2">D2 (Diploma 2)</option>
              <option value="D3">D3 (Diploma 3 / Ahli Madya)</option>
              <option value="D4">D4 / Sarjana Terapan</option>
              <option value="S1">S1 (Strata 1)</option>
              <option value="S2">S2 (Strata 2 / Magister)</option>
              <option value="S3">S3 (Strata 3 / Doktor)</option>  
            </select>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block font-medium mb-1">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Masukkan URL LinkedIn (opsional)"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Masukkan password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-red-700"
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

        <p className="text-center text-sm text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <a
            href="/loginMhs"
            className="text-red-900 font-semibold hover:underline"
          >
            Login di sini
          </a>
        </p>
      </div>
    </div>
  );
}
