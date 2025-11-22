"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowLeft} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
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

          {/* NIM */}
          <div>
            <label className="block font-medium mb-1 text-black">NIM</label>
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black placeholder:text-gray"
              placeholder="Masukkan NIM"
              required
            />
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block font-medium mb-1 text-black">Nama Lengkap</label>
            <input
              type="text"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black placeholder:text-gray"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block font-medium mb-1 text-black">Tanggal Lahir</label>
            <input
              type="date"
              name="tanggal_lahir"
              value={formData.tanggal_lahir}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black"
              required
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block font-medium mb-1 text-black">Jenis Kelamin</label>
            <div className="flex gap-4 text-black">
              <label className="flex items-center text-black">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="1"
                  checked={formData.jenis_kelamin === "1"}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2 text-black">Laki-laki</span>
              </label>

              <label className="flex items-center text-black">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="2"
                  checked={formData.jenis_kelamin === "2"}
                  onChange={handleChange}
                  required
                />
                <span className="ml-2 text-black">Perempuan</span>
              </label>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block font-medium mb-1 text-black">Alamat</label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black placeholder:text-gray"
              placeholder="Masukkan alamat lengkap"
              rows="3"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black placeholder:text-gray"
              placeholder="Masukkan email aktif"
              required
            />
          </div>

          {/* No Telepon */}
          <div>
            <label className="block font-medium mb-1 text-black">No Telepon</label>
            <input
              type="text"
              name="no_telephone"
              value={formData.no_telephone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black placeholder:text-gray"
              placeholder="Masukkan nomor telepon"
              required
            />
          </div>

          {/* Program Studi */}
          <div>
            <label className="block font-medium mb-1 text-black">Program Studi</label>
            <select
              name="prodi"
              value={formData.prodi}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black"
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
            <label className="block font-medium mb-1 text-black">Pendidikan Terakhir</label>
            <select
              name="pendidikan_terakhir"
              value={formData.pendidikan_terakhir}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black"
              required
            >
              <option value="">Pilih Pendidikan</option>
              <option value="SDMI">SD / MI</option>
              <option value="SMPMTs">SMP / MTs</option>
              <option value="SMAMA">SMA / MA</option>
              <option value="SMK">SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block font-medium mb-1 text-black">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black placeholder:text-gray"
              placeholder="Masukkan URL LinkedIn (opsional)"
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
