"use client";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  useAdminAuth();  // ⬅ proteksi admin
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
      if (key !== "linkedin" && !formData[key]) {
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
        alert("Berhasil menambahkan.");
        const confirmExit = confirm("Apakah Anda ingin keluar?");
        if (confirmExit) {
          router.back();
        } else {
          // RESET FORM SAJA
          setFormData({
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
          setShowPassword(false);
        }

      } else {
        alert("Gagal menambahkan: " + result.message);
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
              <label className="flex items-center">
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
              <label className="flex items-center">
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
            <EditableSelectField
              label="Program Studi"
              name="prodi"
              value={formData.prodi}
              onChange={handleChange}
              options={[
                "Informatika",
                "Teknik Mesin",
                "Teknik Elektro",
                "Matematika",
                "Biologi",
                "Fisika",
                "Farmasi",
                "Psikologi",
                "Ilmu Komunikasi",
                "Manajemen",
                "Akuntasi",
                "Ekonomi",
                "Pendidikan Bahasa Inggris",
                "Pendidikan Bahasa Indonesia",
                "Pendidikan Fisika",
                "Pendidikan Biologi",
                "Pendidikan Guru SD",
                "Bimbingan dan Konseling",
                "Arsitektur",
                "Sastra Inggris",
                "Sastra Indonesia",
                "Sastra Jerman",
                "Sastra Prancis",
                "Ilmu Hukum",
                "Keperawatan",
                "Teknik Sipil",
              ]}
            />
          </div>

          {/* Pendidikan Terakhir */}
          <div>
            <EditableSelectField
              label="Pendidikan Terakhir"
              name="pendidikan_terakhir"
              value={formData.pendidikan_terakhir}
              onChange={handleChange}
              options={[
                "SD / MI",
                "SMP / MTs",
                "SMA / MA",
                "SMK",
                "D1",
                "D2",
                "D3",
                "D4",
                "S1",
                "S2",
                "S3",
              ]}
            />

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
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-black"
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
            Tambahkan
          </button>
        </form>
      </div>
    </div>
  );
}

function EditableSelectField({ label, name, value, onChange, options, icon }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState(value || "");

  const normalizeText = (opt) => {
    if (typeof opt === "string") return opt;
    if (typeof opt === "object") return opt.label || "";
    return "";
  };

  const filteredOptions = options.filter((opt) =>
    normalizeText(opt).toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (opt) => {
    if (typeof opt === "string") {
      onChange({ target: { name, value: opt } });
      setFilter(opt);
    } else {
      onChange({ target: { name, value: opt.value } });
      setFilter(opt.label);
    }
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {icon}
          </div>
        )}

        <input
          name={name}
          value={filter}
          placeholder={`Pilih atau ketik ${label}`}
          onChange={(e) => {
            setFilter(e.target.value);
            setShowDropdown(true);
            onChange({ target: { name, value: e.target.value } });
          }}
          onFocus={() => setShowDropdown(true)}
          className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 ${icon ? "pl-12" : ""
            } focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20`}
        />
      </div>

      {showDropdown && (
        <div className="absolute w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-lg max-h-52 overflow-y-auto z-50">
          {filteredOptions.length === 0 ? (
            <p className="px-4 py-2 text-gray-500 text-sm">Tidak ada pilihan</p>
          ) : (
            filteredOptions.map((opt, idx) => {
              const text = normalizeText(opt);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  {text}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}