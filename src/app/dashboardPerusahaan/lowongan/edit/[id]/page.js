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

export default function EditLowongan() {
  useProtectedAuth();
  const router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === STATE FORM ===
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
    keahlian: "",
  });

  // === STATE MULTISELECT KEAHLIAN ===
  const [keahlianList, setKeahlianList] = useState([]);

  // === STATE PENCARIAN SKILL ===
  const [searchSkill, setSearchSkill] = useState("");
  const filteredSkills = daftarKeahlian.filter((skill) =>
    skill.toLowerCase().includes(searchSkill.toLowerCase())
  );

  // === LOAD DATA LAMA ===
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/lowongan/${id}`);
        const data = await res.json();

        if (data.success && data.data) {
          const formatted = {
            ...data.data,
            tanggal_ditutup: data.data.tanggal_ditutup
              ? new Date(data.data.tanggal_ditutup).toISOString().split("T")[0]
              : "",
            external_url: data.data.external_url || "",
          };

          // Set keahlian awal (array)
          setKeahlianList(
            data.data.keahlian ? data.data.keahlian.split(",") : []
          );

          setForm(formatted);
        }
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // === UPDATE INPUT ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // === SUBMIT ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = { ...form };

    try {
      const res = await fetch(`/api/lowongan/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert("Berhasil diperbarui!");
        router.back();
      } else {
        alert("Gagal update!");
      }
    } catch {
      alert("Error server");
    }

    setIsSubmitting(false);
  };

  // === DELETE ===
  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus lowongan ini?")) return;

    try {
      const res = await fetch(`/api/lowongan/delete/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (json.success) {
        alert("Lowongan terhapus!");
        router.back();
      }
    } catch {
      alert("Gagal menghapus");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Memuat...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* === FORM START === */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>

            {/* === SECTION INFORMASI DASAR === */}
            <div className="p-8 border-b">
              <h2 className="text-xl font-bold mb-6">Informasi Dasar</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="md:col-span-2">
                  <InputField
                    label="Nama Posisi"
                    name="nama_posisi"
                    value={form.nama_posisi}
                    onChange={handleChange}
                  />
                </div>

                <SelectField
                  label="Tipe Pekerjaan"
                  name="tipe_pekerjaan"
                  value={form.tipe_pekerjaan}
                  onChange={handleChange}
                  options={["Full-time", "Part-time", "Contract", "Internship"]}
                />

                <SelectField
                  label="Tingkat Pengalaman"
                  name="tingkat_pengalaman"
                  value={form.tingkat_pengalaman}
                  onChange={handleChange}
                  options={["Entry Level", "Junior", "Mid Level", "Senior"]}
                />

                {/* === MULTISELECT KEAHLIAN + SEARCH === */}
                <div className="md:col-span-2">
                  <label className="block font-semibold mb-2">
                    Keahlian (maks 5)
                  </label>

                  {/* SEARCH */}
                  <input
                    type="text"
                    placeholder="Cari keahlian..."
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 mb-2"
                  />

                  {/* DROPDOWN */}
                  <div className="max-h-48 overflow-y-auto border rounded-xl p-2 bg-white">
                    {filteredSkills.length === 0 ? (
                      <p className="text-gray-500 text-sm italic px-2">
                        Tidak ditemukan
                      </p>
                    ) : (
                      filteredSkills.map((skill, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            let updated;

                            if (
                              !keahlianList.includes(skill) &&
                              keahlianList.length >= 5
                            ) {
                              alert("Maksimal 5 keahlian!");
                              return;
                            }

                            if (keahlianList.includes(skill)) {
                              updated = keahlianList.filter((s) => s !== skill);
                            } else {
                              updated = [...keahlianList, skill];
                            }

                            setKeahlianList(updated);
                            setForm({ ...form, keahlian: updated.join(",") });
                          }}
                          className={`cursor-pointer px-3 py-2 rounded-lg mb-1 border transition-all ${
                            keahlianList.includes(skill)
                              ? "bg-red-100 border-red-300 text-red-700"
                              : "hover:bg-gray-100 border-gray-300"
                          }`}
                        >
                          {skill}
                        </div>
                      ))
                    )}
                  </div>

                  {/* BADGES */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {keahlianList.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full flex items-center gap-2"
                      >
                        {skill}
                        <button
                          onClick={() => {
                            const updated = keahlianList.filter(
                              (x) => x !== skill
                            );
                            setKeahlianList(updated);
                            setForm({ ...form, keahlian: updated.join(",") });
                          }}
                          className="text-red-600 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* === SECTION DESKRIPSI === */}
            <div className="p-8 border-b">
              <TextAreaField
                label="Deskripsi Pekerjaan"
                name="deskripsi_pekerjaan"
                value={form.deskripsi_pekerjaan}
                onChange={handleChange}
              />

              <TextAreaField
                label="Kualifikasi"
                name="kualifikasi"
                value={form.kualifikasi}
                onChange={handleChange}
              />
            </div>

            {/* === SECTION KOMPENSASI === */}
            <div className="p-8">
              <SelectField
                label="Range Gaji"
                name="gaji"
                value={form.gaji}
                onChange={handleChange}
                options={[
                  "< Rp3.000.000",
                  "Rp3–5 Juta",
                  "Rp5–8 Juta",
                  "Rp8–12 Juta",
                  "> Rp12 Juta",
                ]}
              />

              <InputField
                label="Lokasi"
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
              />

              <InputField
                type="date"
                label="Tanggal Penutupan"
                name="tanggal_ditutup"
                value={form.tanggal_ditutup}
                onChange={handleChange}
              />
            </div>

            {/* === BUTTONS === */}
            <div className="flex gap-4 p-8 bg-gray-50 border-t">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full border-red-600 text-red-600 py-3 rounded-xl border"
              >
                Hapus Lowongan
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-700 text-white py-3 rounded-xl"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

/* ====== COMPONENTS ====== */
function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="font-semibold text-sm mb-2 block">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded-xl px-4 py-3"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="font-semibold text-sm mb-2 block">{label}</label>
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded-xl px-4 py-3"
      >
        <option value="">Pilih {label}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="font-semibold text-sm mb-2 block">{label}</label>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full border rounded-xl px-4 py-3"
        rows="4"
      ></textarea>
    </div>
  );
}
