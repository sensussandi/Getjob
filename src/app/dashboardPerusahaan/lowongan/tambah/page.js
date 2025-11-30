"use client";
import useProtectedAuth from "@/hooks/useProtectedAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
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

// === Daftar Keahlian Super Lengkap ===
const daftarKeahlian = [
  "Web Developer", "Frontend Developer", "Backend Developer", "Fullstack Developer",
  "Mobile Developer (Android/iOS)", "Game Developer", "UI/UX Designer",
  "Data Analyst", "Data Scientist", "BI Analyst", "Machine Learning Engineer",
  "AI Engineer", "Deep Learning Engineer", "Cloud Engineer", "DevOps Engineer",
  "Cyber Security Specialist", "Network Engineer", "Database Administrator",
  "QA Engineer", "IT Support", "System Administrator",
  "Blockchain Developer", "IoT Engineer", "AR/VR Developer",
  "Business Analyst", "Product Manager", "Project Manager", "Finance Analyst",
  "HR", "Marketing", "Digital Marketing", "Sales Executive",
  "Graphic Designer", "Video Editor", "Animator", "3D Artist", "Content Creator",
  "Copywriter", "Photographer", "Event Organizer", "Brand Strategist",
  "Guru", "Tutor Privat", "Peneliti", "Konselor Pendidikan",
  "Perawat", "Bidan", "Apoteker", "Ahli Gizi", "Analis Kesehatan",
  "Teknisi Mesin", "Teknisi Listrik", "Operator Produksi", "Quality Control",
  "Admin Kantor", "Barista", "Kasir", "Driver", "Kurir",
];

export default function TambahLowongan() {
  useProtectedAuth();
  const router = useRouter();
  const { data: session } = useSession();

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
    keahlian: "",
    external_url: "",
    id_admin: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // === STATE MULTISELECT KEAHLIAN ===
  const [keahlianList, setKeahlianList] = useState([]);
  const [searchSkill, setSearchSkill] = useState("");

  const filteredSkills = daftarKeahlian.filter((skill) =>
    skill.toLowerCase().includes(searchSkill.toLowerCase())
  );

  const handleSkillClick = (skill) => {
    let updated;

    if (!keahlianList.includes(skill) && keahlianList.length >= 5) {
      alert("Maksimal 5 keahlian!");
      return;
    }

    if (keahlianList.includes(skill)) {
      updated = keahlianList.filter((x) => x !== skill);
    } else {
      updated = [...keahlianList, skill];
    }

    setKeahlianList(updated);
    setForm({ ...form, keahlian: updated.join(",") });
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let idAdminFinal = session.user.role === "admin"
        ? session.user.id
        : form.id_admin;

      if (session.user.role === "super_admin" && !form.id_admin) {
        alert("Super Admin wajib memilih perusahaan!");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch(`/api/perusahaan/lowongan/tambah?id_admin=${idAdminFinal}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.success) {
        alert("Lowongan berhasil dibuat!");
        router.back();
      } else {
        alert(json.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // DROPDOWN DATA
  const tipePekerjaan = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
  const tingkatPengalaman = ["Entry Level", "Junior", "Mid Level", "Senior", "Lead/Manager"];
  const rangeGaji = ["< Rp3.000.000", "Rp3–5 Juta", "Rp5–8 Juta", "Rp8–12 Juta", "> Rp12 Juta"];
  const kota = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Semarang", "Medan", "Bali", "Derpo", "Bekasi", "Remote"];
  const daftarProdi = ["S1 Informatika", "S1 Ilmu Komunikasi", "S1 Manajemen", "S1 Psikologi", "S1 Teknik Elektro"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#800000] to-[#b22222] rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Buat Lowongan Baru</h1>
                <p className="text-white/90 text-sm">Lengkapi informasi lowongan pekerjaan</p>
              </div>
            </div>

            <button
              onClick={() => router.back()}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit}>

            {/* INFORMASI DASAR */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Building2 className="w-5 h-5 text-[#800000]" /> Informasi Dasar
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <InputField
                  label="Nama Posisi"
                  name="nama_posisi"
                  value={form.nama_posisi}
                  onChange={handleChange}
                  placeholder="Contoh: Web Developer"
                  icon={<Briefcase className="w-5 h-5 text-gray-400" />}
                  className="md:col-span-2"
                />

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

                <SelectField
                  label="Program Studi"
                  name="prodi"
                  value={form.prodi}
                  onChange={handleChange}
                  options={daftarProdi}
                  icon={<GraduationCap className="w-5 h-5 text-gray-400" />}
                />

                {/* === MULTISELECT KEAHLIAN === */}
                <div className="md:col-span-2">
                  <label className="font-semibold text-gray-700">Keahlian (maks 5)</label>

                  <input
                    type="text"
                    placeholder="Cari keahlian..."
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 mt-2 mb-2"
                  />

                  <div className="max-h-44 overflow-y-auto border rounded-xl p-2 bg-white">
                    {filteredSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSkillClick(skill)}
                        className={`cursor-pointer px-3 py-2 rounded-lg mb-1 border transition-all ${
                          keahlianList.includes(skill)
                            ? "bg-red-100 border-red-300 text-red-700"
                            : "hover:bg-gray-100 border-gray-300"
                        }`}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {keahlianList.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillClick(skill)}
                          className="font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* DESKRIPSI */}
            <div className="p-8 border-b bg-gray-50">
              <TextAreaField
                label="Deskripsi Pekerjaan"
                name="deskripsi_pekerjaan"
                value={form.deskripsi_pekerjaan}
                onChange={handleChange}
                placeholder="Tuliskan deskripsi pekerjaan..."
              />

              <TextAreaField
                label="Kualifikasi"
                name="kualifikasi"
                value={form.kualifikasi}
                onChange={handleChange}
                placeholder="Contoh: minimal S1..."
              />
            </div>

            {/* KOMPENSASI */}
            <div className="p-8">
              <SelectField
                label="Range Gaji"
                name="gaji"
                value={form.gaji}
                onChange={handleChange}
                options={rangeGaji}
                icon={<DollarSign className="w-5 h-5 text-gray-400" />}
              />

              <SelectField
                label="Lokasi"
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                options={kota}
                icon={<MapPin className="w-5 h-5 text-gray-400" />}
              />

              <InputField
                label="Tanggal Penutupan"
                name="tanggal_ditutup"
                type="date"
                value={form.tanggal_ditutup}
                onChange={handleChange}
                icon={<CalendarDays className="w-5 h-5 text-gray-400" />}
              />
            </div>

            {/* BUTTON SUBMIT */}
            <div className="px-8 py-6 bg-gray-50 border-t flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border py-3 rounded-xl"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#800000] text-white py-3 rounded-xl"
              >
                {isSubmitting ? "Menyimpan..." : "Publikasikan Lowongan"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

/* =============== COMPONENTS =============== */

function InputField({ label, name, value, onChange, type = "text", placeholder, icon }) {
  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`w-full border rounded-xl px-4 py-3 ${icon ? "pl-12" : ""}`}
        />
      </div>
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, icon }) {
  return (
    <div>
      <label className="block font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full border rounded-xl px-4 py-3 ${icon ? "pl-12" : ""}`}
        >
          <option value="">Pilih {label}</option>
          {options.map((item, i) =>
            typeof item === "string" ? (
              <option key={i} value={item}>{item}</option>
            ) : (
              <option key={i} value={item.value}>{item.label}</option>
            )
          )}
        </select>
      </div>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder }) {
  return (
    <div className="mt-4">
      <label className="block font-semibold text-gray-700 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        rows="4"
        className="w-full border rounded-xl px-4 py-3"
      ></textarea>
    </div>
  );
}
