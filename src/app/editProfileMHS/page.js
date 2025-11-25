"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

export default function PengaturanPage() {
  const { data: session, status} = useSession();


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

  const [previewFoto, setPreviewFoto] = useState("/default-avatar.png");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cvLama, setCvLama] = useState(null);

  // Ambil data dari sessionStorage ATAU dari server
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedDraft = sessionStorage.getItem("editProfileDraft");
        if (savedDraft) {
          // Jika ada draft tersimpan, pakai itu
          const parsed = JSON.parse(savedDraft);
          setFormData((prev) => ({ ...prev, ...parsed }));
          if (parsed.cvLama) setCvLama(parsed.cvLama);
          if (parsed.previewFoto) setPreviewFoto(parsed.previewFoto);
          setLoading(false);
          return;
        }

        // Jika belum ada draft, ambil dari database
        if (!session?.user?.nim) return;
        const res = await fetch(`/api/editProfileMHS?nim=${session.user.nim}`);
        const data = await res.json();

        if (data.success && data.user) {
          setFormData({
            nim: data.user.nim,
            nama_lengkap: data.user.nama_lengkap || "",
            password: "",
            tanggal_lahir: data.user.tanggal_lahir ? data.user.tanggal_lahir.split("T")[0] : "",
            jenis_kelamin: data.user.jenis_kelamin?.toString() || "",
            alamat: data.user.alamat || "",
            email: data.user.email || "",
            no_telephone: data.user.no_telephone || "",
            prodi: data.user.prodi || "",
            pendidikan_terakhir: data.user.pendidikan_terakhir || "",
            linkedin: data.user.linkedin || "",
            keahlian: data.user.keahlian || "",
            tentang_anda: data.user.tentang_anda || "",
            foto: null,
            cv: null,
          });

          setCvLama(data.user.cv ? `/uploads/${data.user.cv}` : null);

          const storedFoto = sessionStorage.getItem("lastUploadedFotoName");
          if (storedFoto) {
            setPreviewFoto(`/uploads/${storedFoto}`);
          } else {
            setPreviewFoto(data.user.foto || "/default-avatar.png");
          }
        }
      } catch (error) {
        console.error("Gagal memuat data user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") loadData();
  }, [session, status]);

  // Simpan otomatis ke sessionStorage kalau data berubah
  useEffect(() => {
    if (!loading) {
      sessionStorage.setItem("editProfileDraft", JSON.stringify({ ...formData, cvLama, previewFoto }));

      // Simpan nama file foto agar bisa direstore
      if (previewFoto?.includes("/uploads/")) {
        const fileName = previewFoto.split("/uploads/")[1];
        if (fileName) sessionStorage.setItem("lastUploadedFotoName", fileName);
      }
    }
  }, [formData, cvLama, previewFoto, loading]);

  // Input handler umum
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });

      if (name === "foto") {
        const localPreview = URL.createObjectURL(files[0]);
        setPreviewFoto(localPreview);

        // Simpan nama file agar saat reload tetap bisa dibaca dari /uploads/
        sessionStorage.setItem("lastUploadedFotoName", files[0].name);
      }

      if (name === "cv") {
        setCvLama(files[0].name);
      }
    }
  };

  // Kirim form ke server
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) form.append(key, value);
      });

      const res = await fetch("/api/editProfileMHS", {
        method: "POST",
        body: form,
      });

      const result = await res.json();
      if (result.success) {
        alert("Data berhasil diperbarui!");
        sessionStorage.removeItem("editProfileDraft");

        // Auto-refresh session NextAuth agar foto langsung berubah di dashboard
        if (typeof window !== "undefined") {
          await update(); // memanggil fungsi dari useSession
        }

        if (formData.foto) {
          setPreviewFoto(`/uploads/${formData.foto.name}`);
          sessionStorage.setItem("lastUploadedFotoName", formData.foto.name);
        }
        if (formData.cv) {
          setCvLama(`/uploads/${formData.cv.name}`);
        }
      } else {
        alert("Gagal memperbarui data!");
      }
    } catch (error) {
      console.error("Error simpan pengaturan:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  if (status === "loading" || loading) return <div className="flex justify-center items-center h-screen text-red-800 font-semibold">Memuat data akun...</div>;

  if (!session?.user)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">Anda belum login.</p>
        <a href="/loginMhs" className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition">
          Ke Halaman Login
        </a>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fff8f8] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-[#6b0000] to-[#b22c2c] text-white p-6 text-center">
          <h1 className="text-3xl font-bold tracking-wide">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center p-8 bg-gradient-to-b from-orange-100 to-gray-100">
          {/* FOTO PROFIL */}
          <div className="flex flex-col items-center mb-5">
            <img src={previewFoto} alt="Foto Profil" className="w-32 h-32 rounded-full object-cover border-4 border-[#6b0000] shadow-lg" />
            <label className="bg-[#6b0000] text-white px-4 py-2 mt-3 rounded-lg text-sm cursor-pointer hover:bg-[#8b0000] transition shadow">
              Pilih Foto
              <input type="file" name="foto" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
            </label>
            <p className="text-xs text-gray-600 mt-1">Format: .jpeg .jpg .png</p>
          </div>

          {/* NIM */}
          <input name="nim" value={formData.nim} readOnly className="border border-gray-300 p-2 w-full mb-3 rounded bg-gray-100 text-gray-700" />

          {/* NAMA */}
          <input name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} placeholder="Nama Lengkap" className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-500" />

          {/* TANGGAL LAHIR */}
          <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900" />

          {/* JENIS KELAMIN */}
          <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900">
            <option value="">Pilih Jenis Kelamin</option>
            <option value="1">Laki-laki</option>
            <option value="2">Perempuan</option>
          </select>

          {/* ALAMAT */}
          <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="2" placeholder="Alamat Lengkap" className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-500" />

          {/* EMAIL */}
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-500" />

          {/* NO HP */}
          <input name="no_telephone" value={formData.no_telephone} onChange={handleChange} placeholder="Nomor WhatsApp" className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-500" />

          {/* PASSWORD */}
          <div className="relative w-full mb-3">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan kata sandi baru (kosongkan jika tidak diubah)"
              className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-500"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#6b0000]">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* PRODI */}
          <select name="prodi" value={formData.prodi} onChange={handleChange} className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900">
            <option value="">Pilih Program Studi</option>
            <option value="Informatika">Informatika</option>
            <option value="TM">Teknik Mesin</option>
            <option value="TE">Teknik Elektro</option>
            <option value="Matematika">Matematika</option>
          </select>

          {/* PENDIDIKAN TERAKHIR */}
          <select name="pendidikan_terakhir" value={formData.pendidikan_terakhir} onChange={handleChange} className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900">
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

          {/* LINKEDIN */}
          <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="Link Profil LinkedIn (opsional)" className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900" />

          {/* KEAHLIAN */}
          <textarea name="keahlian" value={formData.keahlian} onChange={handleChange} rows="2" placeholder="Keahlian atau kemampuan Anda" className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-500" />

          {/* TENTANG ANDA */}
          <textarea name="tentang_anda" value={formData.tentang_anda} onChange={handleChange} rows="3" placeholder="Tulis tentang Anda..." className="border border-gray-400 p-2 w-full mb-3 rounded bg-white text-gray-900 placeholder-gray-500" />

          {/* CV */}
          <div className="w-full mt-3 text-center">
            <p className="font-semibold text-gray-800 mb-1">Unggah CV (opsional)</p>
            {cvLama ? (
              <div className="mb-2">
                <p className="text-sm text-gray-700">
                  CV saat ini:{" "}
                  <a href={cvLama} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                    Lihat CV
                  </a>
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-2 italic">Belum ada CV yang diunggah.</p>
            )}

            <label className="bg-[#6b0000] text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-[#8b0000] transition shadow">
              Pilih file baru
              <input type="file" name="cv" accept=".pdf" onChange={handleFileChange} className="hidden" />
            </label>
            <p className="text-xs text-gray-600 mt-1">Format: .pdf</p>
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex justify-between w-full mt-6">
            <a
              href="/dashboardMHS"
              className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-md px-4 py-2 hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </a>

            <button type="submit" className="bg-red-800 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-md text-sm transition">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
