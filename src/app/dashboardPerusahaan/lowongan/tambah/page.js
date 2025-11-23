"use client";
import useProtectedAuth from "@/hooks/useProtectedAuth";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Briefcase,
  MapPin,
  FileText,
  CalendarDays,
  GraduationCap,
  DollarSign,
  Building2,
  Clock,
  Users,
  X,
} from "lucide-react";

export default function TambahLowongan() {
  useProtectedAuth();  // ⬅ proteksi admin perusahaan dan super admin
  const router = useRouter();
  const redirectByRole = () => {
    const admin = localStorage.getItem("id");
    const perusahaan = localStorage.getItem("id_admin");

    if (admin) return router.push("/dashboardAdmin");
    if (perusahaan) return router.push("/dashboardPerusahaan");

    return router.push("/");
  };
  const [form, setForm] = useState({
    nama_posisi: "",
    deskripsi_pekerjaan: "",
    kualifikasi: "",
    gaji: "",
    lokasi: "",
    tanggal_ditutup: "",
    tipe_pekerjaan: "Full-time",
    tingkat_pengalaman: "Entry Level",
    prodi: "",
    external_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = localStorage.getItem("id_admin");

      if (!id) {
        console.error("ID admin tidak ditemukan di localStorage");
        router.push("/loginPerusahaan");
         return;
      }
      const res = await fetch(`/api/perusahaan/lowongan/tambah?id_admin=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Lowongan berhasil dibuat!");
        redirectByRole();
      } else {
        alert(data.message || "❌ Gagal menambahkan lowongan.");
      }
    } catch (error) {
      alert("⚠️ Terjadi kesalahan. Coba lagi nanti.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Data untuk dropdown
  const rangeGaji = [
    "< Rp 3.000.000",
    "Rp 3.000.000 - Rp 5.000.000",
    "Rp 5.000.000 - Rp 8.000.000",
    "Rp 8.000.000 - Rp 12.000.000",
    "Rp 12.000.000 - Rp 20.000.000",
    "> Rp 20.000.000",
  ];

  const kota = [
    "Jakarta",
    "Bandung",
    "Surabaya",
    "Yogyakarta",
    "Semarang",
    "Medan",
    "Bali",
    "Makassar",
    "Tangerang",
    "Depok",
    "Bogor",
    "Bekasi",
    "Remote",
  ];

  const tipePekerjaan = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance",
  ];

  const tingkatPengalaman = [
    "Entry Level",
    "Junior",
    "Mid Level",
    "Senior",
    "Lead/Manager",
  ];

  const daftarProdi = [
    // ====== D3 ======
    "D3 Bahasa Inggris",
    "D3 Sekretari",
    "D3 Perpustakaan",
    "D3 Teknik Elektronika",

    // ====== S1 ======
    "S1 Akuntansi",
    "S1 Arsitektur",
    "S1 Biologi",
    "S1 Bimbingan dan Konseling",
    "S1 Farmasi",
    "S1 Fisika",
    "S1 Ilmu Komunikasi",
    "S1 Keperawatan",
    "S1 Kimia",
    "S1 Matematika",
    "S1 Manajemen",
    "S1 Pendidikan Akuntansi",
    "S1 Pendidikan Bahasa Inggris",
    "S1 Pendidikan Bahasa Jawa",
    "S1 Pendidikan Bahasa dan Sastra Indonesia",
    "S1 Pendidikan Biologi",
    "S1 Pendidikan Fisika",
    "S1 Pendidikan Guru SD (PGSD)",
    "S1 Pendidikan Kimia",
    "S1 Pendidikan Matematika",
    "S1 Pendidikan Musik",
    "S1 Pendidikan Sejarah",
    "S1 Pendidikan Teologi",
    "S1 Psikologi",
    "S1 Sastra Inggris",
    "S1 Sastra Indonesia",
    "S1 Sastra Jepang",
    "S1 Sistem Informasi",
    "S1 Teknik Elektro",
    "S1 Teknik Informatika",
    "S1 Teknologi Pangan",
    "S1 Teologi",

    // ====== S2 ======
    "S2 Kajian Bahasa Inggris",
    "S2 Kajian Bahasa dan Budaya Indonesia",
    "S2 Pendidikan Bahasa Inggris",
    "S2 Ilmu Religi dan Budaya",
    "S2 Pendidikan Teologi",
    "S2 Manajemen Pendidikan",
    "S2 Kajian Bahasa dan Budaya Jawa",

    // ====== S3 ======
    "S3 Kajian Ilmu Pendidikan",
    "S3 Kajian Budaya",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header dengan gradient */}
        <div className="bg-gradient-to-r from-[#800000] to-[#b22222] rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Buat Lowongan Baru</h1>
                  <p className="text-white/90 text-sm mt-1">
                    Lengkapi informasi lowongan pekerjaan Anda
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#800000]">
          <ArrowLeft className="w-4 h-4" /> Kembali </button>
        {/* Form Container */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Informasi Dasar */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#800000]" />
                Informasi Dasar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black placeholder:text-black">
                {/* Nama Posisi */}
                <div className="md:col-span-2">
                  <InputField
                    label="Nama Posisi"
                    name="nama_posisi"
                    value={form.nama_posisi}
                    onChange={handleChange}
                    placeholder="Contoh: Senior Web Developer"
                    icon={<Briefcase className="w-5 h-5 text-gray-400" />}
                  />
                </div>

                {/* Tipe Pekerjaan */}
                <SelectField
                  label="Tipe Pekerjaan"
                  name="tipe_pekerjaan"
                  value={form.tipe_pekerjaan}
                  onChange={handleChange}
                  options={tipePekerjaan}
                  icon={<Clock className="w-5 h-5 text-gray-400" />}
                />

                {/* Tingkat Pengalaman */}
                <SelectField
                  label="Tingkat Pengalaman"
                  name="tingkat_pengalaman"
                  value={form.tingkat_pengalaman}
                  onChange={handleChange}
                  options={tingkatPengalaman}
                  icon={<Users className="w-5 h-5 text-gray-400" />}
                />

                <SelectField
                  label="Program Studi (Prodi)"
                  name="prodi"
                  value={form.prodi}
                  onChange={handleChange}
                  options={daftarProdi}
                  icon={<GraduationCap className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>

            {/* Section 2: Deskripsi & Kualifikasi */}
            <div className="p-8 bg-gray-50 border-b border-gray-100 text-black placeholder:text-black">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 text-black placeholder:text-black">
                <FileText className="w-5 h-5 text-[#800000]" />
                Deskripsi & Kualifikasi
              </h2>
              <div className="space-y-6">
                {/* Deskripsi Pekerjaan */}
                <TextAreaField
                  label="Deskripsi Pekerjaan"
                  name="deskripsi_pekerjaan"
                  value={form.deskripsi_pekerjaan}
                  onChange={handleChange}
                  placeholder="Tuliskan deskripsi pekerjaan secara rinci, tanggung jawab, dan benefit yang ditawarkan..."
                  rows="5"
                />

                {/* Kualifikasi */}
                <TextAreaField
                  label="Kualifikasi"
                  name="kualifikasi"
                  value={form.kualifikasi}
                  onChange={handleChange}
                  placeholder="Contoh:&#10;• Minimal S1 Informatika/Sistem Informasi&#10;• Menguasai JavaScript, React, Node.js&#10;• Pengalaman minimal 2 tahun&#10;• Mampu bekerja dalam tim"
                  icon={<GraduationCap className="w-5 h-5 text-gray-400" />}
                  rows="5"
                />
              </div>
            </div>

            {/* Section 3: Kompensasi & Lokasi */}
            <div className="p-8 text-black placeholder:text-black">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 text-black placeholder:text-black">
                <DollarSign className="w-5 h-5 text-[#800000]" />
                Kompensasi & Lokasi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Range Gaji */}
                <SelectField
                  label="Range Gaji (per bulan)"
                  name="gaji"
                  value={form.gaji}
                  onChange={handleChange}
                  options={rangeGaji}
                  icon={<DollarSign className="w-5 h-5 text-gray-400" />}
                />

                {/* Lokasi */}
                <SelectField
                  label="Lokasi Kerja"
                  name="lokasi"
                  value={form.lokasi}
                  onChange={handleChange}
                  options={kota}
                  icon={<MapPin className="w-5 h-5 text-gray-400" />}
                />

                {/* web perusahaan*/}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Link Eksternal (Opsional)
                  </label>
                  <input
                    type="url"
                    name="external_url"
                    placeholder="https://website-perusahaan.com/career/it-support"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all hover:border-gray-300"
                    value={form.external_url || ""}
                    onChange={(e) =>
                      setForm({ ...form, external_url: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Jika diisi, pelamar akan diarahkan ke link ini.
                  </p>
                </div>

                {/* Tanggal Penutupan */}
                <div className="md:col-span-2">
                  <InputField
                    label="Tanggal Penutupan Pendaftaran"
                    name="tanggal_ditutup"
                    type="date"
                    value={form.tanggal_ditutup}
                    onChange={handleChange}
                    icon={<CalendarDays className="w-5 h-5 text-gray-400" />}
                  />
                </div>
              </div>
            </div>

            {/* Footer dengan tombol */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#800000] to-[#b22222] hover:from-[#5c0000] hover:to-[#800000] text-white py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Menyimpan...
                  </span>
                ) : (
                  "Publikasikan Lowongan"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Tips Membuat Lowongan yang Menarik
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 ml-7">
            <li>• Tulis deskripsi pekerjaan yang jelas dan detail</li>
            <li>• Sebutkan benefit dan keunggulan perusahaan</li>
            <li>• Gunakan bahasa yang profesional namun ramah</li>
            <li>• Cantumkan kualifikasi yang realistis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ==== Komponen Input Reusable ==== */
function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
}) {
  return (
    <div>
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
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 ${icon ? "pl-12" : ""
            } focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all hover:border-gray-300`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, icon }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            {icon}
          </div>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange}
          required
          className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 ${icon ? "pl-12" : ""
            } focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all hover:border-gray-300 appearance-none bg-white cursor-pointer`}
        >
          <option value="">Pilih {label}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon,
  rows = "4",
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-4 z-10">{icon}</div>}
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required
          rows={rows}
          placeholder={placeholder}
          className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 ${icon ? "pl-12" : ""
            } focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all hover:border-gray-300 resize-none`}
        />
      </div>
    </div>
  );
}
