"use client";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

export default function DetailPerusahaan() {
  useAdminAuth();
  const router = useRouter();
  const { id } = useParams();

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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // === FETCH DATA PERUSAHAAN ===
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/pencaker/kelola/${id}`);
        const result = await res.json();

        if (result.success) {
          setFormData({
          ...result.data, 
          jenis_kelamin: String(result.data.jenis_kelamin),
          });
        } else {
          console.error("Gagal memuat data:", result.message);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // HANDLE SUBMIT EDIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/admin/pencaker/kelola/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("✅ Pencari Kerja berhasil diperbarui!");
        setTimeout(() => router.push("/dashboardAdmin"), 1500);
      } else {
        setMessage("❌ Gagal memperbarui data");
      }
    } catch (error) {
      setMessage("❌ Error server");
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat...</p>;


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-red-700 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-red-900 mb-6">
          Registrasi Akun Mahasiswa
        </h1>
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#800000]">
          <ArrowLeft className="w-4 h-4" /> Kembali </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIM */}
          <div>
            <label className="block font-medium mb-1 text-black">NIM</label>
            <input
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black"
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
              className="w-full border rounded-lg px-3 py-2 text-black"
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
            <div className="flex gap-4">

              {/* Laki-laki */}
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="1"
                  checked={formData.jenis_kelamin === "1"}
                  onChange={handleChange}
                />
                <span className="ml-2 text-black">Laki-laki</span>
              </label>

              {/* Perempuan */}
              <label className="flex items-center">
                <input
                  type="radio"
                  name="jenis_kelamin"
                  value="2"
                  checked={formData.jenis_kelamin === "2"}
                  onChange={handleChange}
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
              className="w-full border rounded-lg px-3 py-2 text-black"
              placeholder="Masukkan alamat lengkap"
              rows="3"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1 text-black">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black"
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
              className="w-full border rounded-lg px-3 py-2 text-black"
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
              <option value="Teknik Mesin">Teknik Mesin</option>
              <option value="Teknik Elektro">Teknik Elektro</option>
              <option value="Matematika">Matematika</option>
              <option value="Biologi">Biologi</option>
              <option value="Fisika">Fisika</option>
              <option value="Biologi">Biologi</option>
              <option value="Farmasi">Farmasi</option>
              <option value="Psikologi">Psikologi</option>
              <option value="Ilmu Komunikasi">Ilmu Komunikasi</option>
              <option value="Manajemen">Manajemen</option>
              <option value="Akuntasi">Akuntasi</option>
              <option value="Ekonomi">Ekonomi</option>
              <option value="Pendidikan Bahasa Inggris">Pendidikan Bahasa Inggris</option>
              <option value="Pendidikan Bahasa Indonesia">Pendidikan Bahasa Indonesia</option>
              <option value="Pendidikan Fisika">Pendidikan Fisika</option>
              <option value="Pendidikan Biologi">Pendidikan Biologi</option>
              <option value="Pendidikan Guru SD">Pendidikan Guru SD</option>
              <option value="Bimbingan dan Konseling">Bimbingan dan Konseling</option>
              <option value="Arsitektur">Arsitektur</option>
              <option value="Sastra Inggris">Sastra Inggris</option>
              <option value="Sastra Indonesia">Sastra Indonesia</option>
              <option value="Sastra Jerman">Sastra Jerman</option>
              <option value="Sastra Prancis">Sastra Prancis</option>
              <option value="Ilmu Hukum">Ilmu Hukum</option>
              <option value="Keperawatan">Keperawatan</option>
              <option value="Teknik Mesin">Teknik Mesin</option>
              <option value="Teknik Sipil">Teknik Sipil</option>
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
            <label className="block font-medium mb-1 text-black">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black"
              placeholder="Masukkan URL LinkedIn (opsional)"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block font-medium mb-1 text-black">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black"
              placeholder="Masukkan password"
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
            Tambahkan
          </button>
        </form>
      </div>
    </div>
  );
}
