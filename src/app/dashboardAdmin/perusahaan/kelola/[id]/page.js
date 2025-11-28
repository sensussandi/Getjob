"use client";
import useAdminAuth from "@/hooks/useAdminAuth";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save} from "lucide-react";

export default function DetailPerusahaan() {
  useAdminAuth();
  const router = useRouter();
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    email_perusahaan: "",
    password: "",
    no_telepone: "",
    logo_url: "",
    alamat_perusahaan: "",
    tentang_perusahaan: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // === FETCH DATA PERUSAHAAN ===
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/perusahaan/kelola/${id}`);
        const result = await res.json();

        if (result.success) {
          setFormData(result.data); // isi otomatis form
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
    setShowPassword(false);
  };

  // HANDLE SUBMIT EDIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/admin/perusahaan/kelola/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("✅ Perusahaan berhasil diperbarui!");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tambah Data Perusahaan</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#800000]"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nama Perusahaan" name="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} required />
            <Input label="Email Perusahaan" name="email_perusahaan" value={formData.email_perusahaan} onChange={handleChange} required />
            <Input label="Password" name="password" type={showPassword ? "text" : "password"} onChange={handleChange} required togglePassword={() => setShowPassword(!showPassword)}/>
            <Input label="No. Telepon" name="no_telepone" value={formData.no_telepone} onChange={handleChange} />
            <Input label="Logo URL (opsional)" name="logo_url" value={formData.logo_url} onChange={handleChange} />
          </div>

          <Textarea label="Alamat Perusahaan (opsional)" name="alamat_perusahaan" value={formData.alamat_perusahaan} onChange={handleChange} />
          <Textarea label="Tentang Perusahaan (opsional)" name="tentang_perusahaan" value={formData.tentang_perusahaan} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-[#800000] text-white py-3 rounded-xl hover:bg-[#a00000] transition-all font-semibold"
          >
            <Save className="w-5 h-5" /> {loading ? "Menyimpan..." : "Simpan Perusahaan"}
          </button>

          {message && (
            <p className={`mt-4 text-center font-medium ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// === Komponen Input & Textarea ===
function Input({ label, name, value, onChange, type = "text", required, showPassword, togglePassword }) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 
                   focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none 
                   text-black"
      />

      {/* tombol show/hide untuk input password */}
      {name === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-9 text-gray-500 hover:text-red-700"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
}

function Textarea({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        rows="3"
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:border-[#800000] outline-none
        text-black"
      />
    </div>
  );
}
