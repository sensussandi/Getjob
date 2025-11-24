"use client";
import useProtectedAuth from "@/hooks/useProtectedAuth";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  MapPin,
  FileText,
  CalendarDays,
  DollarSign,
  Building2,
  Clock,
  Users,
  X,
  Save,
  Trash2,
} from "lucide-react";

export default function EditLowongan() {
  useProtectedAuth();  // ⬅ proteksi admin Perusahaan
  const router = useRouter();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const redirectByRole = () => {

    if (!session) 
      return router.push("/");
    if (session.user.role === "super_admin")
      return router.push("/dashboardAdmin");
    if (session.user.role === "admin")
      return router.push("/dashboardPerusahaan");
    return router.push("/");
  };

  const [form, setForm] = useState({
    nama_posisi: "",
    deskripsi_pekerjaan: "",
    kualifikasi: "",
    gaji: "",
    lokasi: "",
    tanggal_ditutup: "",
    tipe_pekerjaan: "",
    tingkat_pengalaman: "",
    external_url: "",
    prodi: "",
  });

  // 🔹 Ambil data lama dari database
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/lowongan/${id}`);

        if (!res.ok) {
          throw new Error(`Gagal mengambil data. Status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success && data.data) {
          const formattedData = {
            ...data.data,
            tanggal_ditutup: data.data.tanggal_ditutup ? new Date(data.data.tanggal_ditutup).toISOString().split('T')[0] : '',
            external_url: data.data.external_url || '',
          };
          setForm(formattedData);
        } else {
          alert("❌ Lowongan tidak ditemukan atau data kosong.");
          redirectByRole();
        }
      } catch (error) {
        console.error("Gagal mengambil data lowongan:", error);
        alert("⚠️ Terjadi kesalahan saat memuat data.");
        redirectByRole();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  // 🔹 Update field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 Simpan perubahan (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...form,
      external_url: form.external_url.trim() === "" ? null : form.external_url,
    };

    try {
      const res = await fetch(`/api/lowongan/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("✅ Lowongan berhasil diperbarui!");
        redirectByRole();
      } else {
        alert(data.message || "❌ Gagal memperbarui lowongan. Silakan coba lagi.");
      }
    } catch (error) {
      alert("⚠️ Terjadi kesalahan saat update data.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Hapus lowongan
  const handleDelete = async () => {
    if (confirm(`⚠️ Anda yakin ingin menghapus lowongan "${form.nama_posisi}"? Aksi ini tidak bisa dibatalkan.`)) {
      try {
        const res = await fetch(`/api/lowongan/delete/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          alert("🗑️ Lowongan berhasil dihapus!");
          redirectByRole();
        } else {
          alert(data.message || "❌ Gagal menghapus lowongan. Silakan coba lagi.");
        }
      } catch (err) {
        console.error("Gagal menghapus:", err);
        alert("Terjadi kesalahan saat menghapus lowongan.");

      }
    }
  };

  // 🔹 Data dropdown
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

  const tipePekerjaan = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
  const tingkatPengalaman = ["Entry Level", "Junior", "Mid Level", "Senior", "Lead/Manager"];

  // ⭐️ PROGRAM STUDI
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
  // AKHIR PROGRAM STUDI

  // 🔹 Loading State
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600 bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#800000] rounded-full animate-spin mb-3"></div>
        Memuat data lowongan...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 🔹 Header dengan gradient */}
        <div className="bg-gradient-to-r from-[#800000] to-[#b22222] rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Edit Lowongan</h1>
                  <p className="text-white/90 text-sm mt-1">
                    Perbarui informasi lowongan pekerjaan Anda
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

        {/* 🔹 Form Container */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* SECTION 1 */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#800000]" />
                Informasi Dasar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {/* ⭐️ FIELD PRODI BARU DITAMBAHKAN */}
                <div className="md:col-span-2">
                  <SelectField
                    label="Latar Belakang Pendidikan"
                    name="latar_belakang_pendidikan"
                    value={form.prodi}
                    onChange={handleChange}
                    options={daftarProdi}
                    icon={<FileText className="w-5 h-5 text-gray-400" />}
                  />
                </div>
                {/* AKHIR FIELD PRODI BARU */}

                <SelectField
                  label="Tipe Pekerjaan"
                  name="tipe_pekerjaan"
                  value={form.tipe_pekerjaan}
                  onChange={handleChange}
                  options={tipePekerjaan}
                  icon={<Clock className="w-5 h-5 text-gray-400" />}
                />

                <SelectField
                  label="Tingkat Pengalaman"
                  name="tingkat_pengalaman"
                  value={form.tingkat_pengalaman}
                  onChange={handleChange}
                  options={tingkatPengalaman}
                  icon={<Users className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>

            {/* SECTION 2 */}
            <div className="p-8 bg-gray-50 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#800000]" />
                Deskripsi & Kualifikasi
              </h2>
              <div className="space-y-6">
                <TextAreaField
                  label="Deskripsi Pekerjaan"
                  name="deskripsi_pekerjaan"
                  value={form.deskripsi_pekerjaan}
                  onChange={handleChange}
                  placeholder="Tuliskan deskripsi pekerjaan secara rinci..."
                  rows="5"
                />
                <TextAreaField
                  label="Kualifikasi"
                  name="kualifikasi"
                  value={form.kualifikasi}
                  onChange={handleChange}
                  placeholder="Tuliskan kualifikasi yang dibutuhkan..."
                  rows="5"
                />
              </div>
            </div>

            {/* SECTION 3 */}
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#800000]" />
                Kompensasi & Lokasi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Range Gaji (per bulan)"
                  name="gaji"
                  value={form.gaji}
                  onChange={handleChange}
                  options={rangeGaji}
                  icon={<DollarSign className="w-5 h-5 text-gray-400" />}
                />

                <SelectField
                  label="Lokasi Kerja"
                  name="lokasi"
                  value={form.lokasi}
                  onChange={handleChange}
                  options={kota}
                  icon={<MapPin className="w-5 h-5 text-gray-400" />}
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Link Eksternal (Opsional)
                  </label>
                  <input
                    type="url"
                    name="external_url"
                    placeholder="https://website-perusahaan.com/career/it-support"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all hover:border-gray-300"
                    value={form.external_url || ""}
                    onChange={handleChange}
                  />
                </div>

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

            {/* 🔹 Footer Buttons */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 border-2 border-red-500 text-red-600 hover:bg-red-50 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" /> Hapus Lowongan
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
                  <>
                    <Save className="w-5 h-5 inline mr-1" /> Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ==== Komponen Reusable (Tidak ada perubahan) ==== */
function InputField({ label, name, value, onChange, type = "text", placeholder, icon }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>}
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 ${icon ? "pl-12" : ""
            } text-gray-900 placeholder-gray-400 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all hover:border-gray-300`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, icon }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2">{icon}</div>}
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 ${icon ? "pl-12" : ""
            } text-gray-900 placeholder-gray-400 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all hover:border-gray-300 appearance-none bg-white cursor-pointer`}
        >
          <option value="">Pilih {label}</option>
          {options.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder, rows = "4" }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/20 outline-none transition-all hover:border-gray-300 resize-none"
      />
    </div>
  );
}