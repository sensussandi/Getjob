"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

export default function PengaturanPage() {
  const { data: session, status, update } = useSession();

  const [formData, setFormData] = useState({
    nim: "",
    nama_lengkap: "",
    password: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    email: "",
    no_telephone: "",
    prodi: "",
    pendidikan_terakhir: "",
    linkedin: "",
    keahlian: "",
    tentang_anda: "",
    foto: null,
    cv: null,
  });

  const [previewFoto, setPreviewFoto] = useState("/default-avatar.jpg");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cvLama, setCvLama] = useState(null);

  // ======================== LOAD DATA ========================
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!session || session.user.role !== "alumni") return;

        const res = await fetch(`/api/editProfileMHS?nim=${session.user.id}`);
        const data = await res.json();

        if (data.success && data.user) {
          const user = data.user;

          setFormData({
            nim: user.nim,
            nama_lengkap: user.nama_lengkap || "",
            password: "",
            tanggal_lahir: user.tanggal_lahir?.split("T")[0] || "",
            jenis_kelamin: user.jenis_kelamin?.toString() || "",
            alamat: user.alamat || "",
            email: user.email || "",
            no_telephone: user.no_telephone || "",
            prodi: user.prodi || "",
            pendidikan_terakhir: user.pendidikan_terakhir || "",
            linkedin: user.linkedin || "",
            keahlian: user.keahlian || "",
            tentang_anda: user.tentang_anda || "",
            foto: null,
            cv: null,
          });

          setCvLama(user.cv || null);
          setPreviewFoto(user.foto || "/default-avatar.jpg");
        }
      } catch (e) {
        console.error("Error load data:", e);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") loadData();
  }, [session, status]);


  // ======================== HANDLER ========================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files?.[0]) {
      setFormData({ ...formData, [name]: files[0] });

      if (name === "foto") {
        setPreviewFoto(URL.createObjectURL(files[0]));
      }

      if (name === "cv") {
        setCvLama(files[0].name);
      }
    }
  };


  // ======================== SUBMIT ========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) form.append(k, v);
      });

      const res = await fetch("/api/editProfileMHS", {
        method: "POST",
        body: form,
      });

      const result = await res.json();

      if (result.success) {
        alert("Data berhasil diperbarui!");

        // Update session NEXTAUTH
        await update({
          ...session.user,
          foto: result.fotoBaru ? result.fotoBaru : session.user.foto,
        });

        // Update preview foto
        if (result.fotoBaru) {
          setPreviewFoto(result.fotoBaru);
        }

        // Update CV lama
        if (result.cvBaru) {
          setCvLama(result.cvBaru);
        }
      } else {
        alert("Gagal memperbarui data!");
      }
    } catch (err) {
      console.error("Error simpan:", err);
      alert("Terjadi kesalahan.");
    }
  };


  // ======================== UI ========================
  if (status === "loading" || loading)
    return <div className="flex justify-center items-center h-screen">Memuat data...</div>;

  if (!session?.user)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Anda belum login.</p>
        <a href="/loginMhs" className="bg-red-700 text-white px-4 py-2 rounded-md mt-4">
          Login
        </a>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fff8f8] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#6b0000] to-[#b22c2c] text-white p-6 text-center">
          <h1 className="text-3xl font-bold tracking-wide">Edit Profile</h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center p-8 bg-gradient-to-b from-orange-100 to-gray-100">

          {/* FOTO */}
          <div className="flex flex-col items-center mb-5">
            <img
              src={previewFoto}
              alt="Foto Profil"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#6b0000] shadow-lg"
            />

            <label className="bg-[#6b0000] text-white px-4 py-2 mt-3 rounded-lg text-sm cursor-pointer hover:bg-[#8b0000] transition shadow">
              Pilih Foto
              <input type="file" name="foto" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
            </label>

            <p className="text-xs text-gray-600 mt-1">Format: .jpeg .jpg .png</p>
          </div>

          {/* INPUTS */}
          <input name="nim" value={formData.nim} readOnly className="border border-gray-300 p-3 w-full mb-3 rounded bg-gray-100 text-gray-800"/>

          <input name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} placeholder="Nama Lengkap" className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-600" />

          <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900" />

          <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900">
            <option value="">Pilih Jenis Kelamin</option>
            <option value="1">Laki-laki</option>
            <option value="2">Perempuan</option>
          </select>

          <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="2" placeholder="Alamat Lengkap" className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-600" />

          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-600" />

          <input name="no_telephone" value={formData.no_telephone} onChange={handleChange} placeholder="Nomor WhatsApp" className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-600" />

          {/* PASSWORD */}
          <div className="relative w-full mb-3">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Kata sandi baru (opsional)"
              className="border border-gray-400 p-3 w-full rounded bg-white text-gray-900 placeholder-gray-600"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* DROPDOWNS */}
          <select name="prodi" value={formData.prodi} onChange={handleChange} className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900">
            <option value="">Pilih Program Studi</option>
            <option value="Informatika">Informatika</option>
            <option value="TM">Teknik Mesin</option>
            <option value="TE">Teknik Elektro</option>
            <option value="Matematika">Matematika</option>
          </select>

          <select name="pendidikan_terakhir" value={formData.pendidikan_terakhir} onChange={handleChange} className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900">
            <option value="">Pendidikan Terakhir</option>
            <option value="SDMI">SD / MI</option>
            <option value="SMPMTs">SMP / MTs</option>
            <option value="SMAMA">SMA / MA</option>
            <option value="SMK">SMK</option>
            <option value="D1">D1</option>
            <option value="D2">D2</option>
            <option value="D3">D3</option>
            <option value="D4">D4 / Sarjana Terapan</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
          </select>

          <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="Link LinkedIn" className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-600" />

          <textarea name="keahlian" value={formData.keahlian} onChange={handleChange} rows="2" placeholder="Keahlian" className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-600" />

          <textarea name="tentang_anda" value={formData.tentang_anda} onChange={handleChange} rows="3" placeholder="Tentang Anda" className="border border-gray-400 p-3 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-600" />

          {/* CV */}
          <div className="w-full mt-3 text-center">
            <p className="font-semibold text-gray-800 mb-1">Unggah CV (opsional)</p>

            {cvLama ? (
              <p className="text-sm text-gray-700 mb-2">
                CV saat ini:{" "}
                <a href={cvLama} className="text-blue-600 hover:underline" target="_blank">
                  Lihat CV
                </a>
              </p>
            ) : (
              <p className="text-sm text-gray-500 italic mb-2">Belum ada CV.</p>
            )}

            <label className="bg-[#6b0000] text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-[#8b0000] transition shadow">
              Pilih file baru
              <input type="file" name="cv" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* BUTTON */}
          <div className="flex justify-between w-full mt-6">
            <a
              href="/dashboardMHS"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-md hover:from-orange-600 hover:to-orange-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </a>

            <button type="submit" className="bg-red-800 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-md">
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}