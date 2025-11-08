"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaPen, FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

export default function PengaturanPage() {
    const { data: session, status } = useSession();

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

    const [previewFoto, setPreviewFoto] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

  // Ambil data user lengkap dari database
    useEffect(() => {
    const fetchUser = async () => {
        try {
        if (!session?.user?.nim) return;
        const res = await fetch(`/api/editProfileMHS?nim=${session.user.nim}`);
        const data = await res.json();

        if (data.success && data.user) {
            setFormData({
            nim: data.user.nim,
            nama_lengkap: data.user.nama_lengkap || "",
            password: data.user.password || "",
            tanggal_lahir: data.user.tanggal_lahir
                ? data.user.tanggal_lahir.split("T")[0]
                : "",
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
            setPreviewFoto(
            data.user.foto ? `/uploads/${data.user.foto}` : "/default-avatar.png"
            );
        }
        } catch (err) {
        console.error("Gagal memuat data user:", err);
        } finally {
        setLoading(false);
        }
    };

    if (status === "authenticated") fetchUser();
    }, [session, status]);

    const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
        setFormData({ ...formData, [name]: files[0] });
        if (name === "foto") setPreviewFoto(URL.createObjectURL(files[0]));
    }
    };

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
        } else {
        alert("Gagal memperbarui data!");
        }
    } catch (error) {
        console.error("Error simpan pengaturan:", error);
        alert("Terjadi kesalahan saat menyimpan data.");
    }
    };

    if (status === "loading" || loading)
    return (
        <div className="flex justify-center items-center h-screen text-red-800 font-semibold">
        Memuat data akun...
        </div>
    );

    if (!session?.user)
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">Anda belum login.</p>
        <a
            href="/loginMhs"
            className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
        >
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

        <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center p-8 bg-gradient-to-b from-orange-100 to-gray-100"
        >
          {/* FOTO PROFIL */}
            <div className="flex flex-col items-center mb-5">
            <img
                src={previewFoto || "/default-avatar.png"}
                alt="Foto Profil"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#6b0000] shadow-lg"
            />
            <label className="bg-[#6b0000] text-white px-4 py-2 mt-3 rounded-lg text-sm cursor-pointer hover:bg-[#8b0000] transition shadow">
                Pilih Foto
                <input
                type="file"
                name="foto"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                />
            </label>
            <p className="text-xs text-gray-600 mt-1">
                Format: .jpeg .jpg .png
            </p>
            </div>

          {/* NIM (tidak bia diedit) */}
            <input
            name="nim"
            value={formData.nim}
            readOnly
            className="border border-gray-300 p-2 w-full mb-3 rounded bg-gray-100 text-gray-500"
            />

          {/* NAMA */}
            <input
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            />

          {/* TANGGAL LAHIR */}
            <input
            type="date"
            name="tanggal_lahir"
            value={formData.tanggal_lahir}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            />

          {/* JENIS KELAMIN */}
            <select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            >
            <option value="">Pilih Jenis Kelamin</option>
            <option value="1">Laki-laki</option>
            <option value="2">Perempuan</option>
            </select>

          {/* ALAMAT */}
            <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            rows="2"
            placeholder="Alamat Lengkap"
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            />

          {/* EMAIL */}
            <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            />

          {/* NO HP */}
            <input
            name="no_telephone"
            value={formData.no_telephone}
            onChange={handleChange}
            placeholder="Nomor WhatsApp"
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            />

          {/* PASSWORD */}
            <div className="relative w-full mb-3">
            <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Ubah Kata Sandi"
                className="border border-gray-300 p-2 w-full pr-10 rounded"
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#6b0000]"
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            </div>

          {/* PRODI */}
            <select
            name="prodi"
            value={formData.prodi}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            >
            <option value="">Pilih Program Studi</option>
            <option value="Informatika">Informatika</option>
            <option value="TM">Teknik Mesin</option>
            <option value="TE">Teknik Elektro</option>
            <option value="Matematika">Matematika</option>
            </select>

          {/* PENDIDIKAN TERAKHIR */}
            <select
            name="pendidikan_terakhir"
            value={formData.pendidikan_terakhir}
            onChange={handleChange}
            placeholder="Pendidikan Terakhir"
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            >
            <option value="">Pendidikan Terakhir</option>
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

          {/* LINKEDIN */}
            <input
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="Link Profil LinkedIn (opsional)"
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            />

          {/* KEAHLIAN */}
            <textarea
            name="keahlian"
            value={formData.keahlian}
            onChange={handleChange}
            rows="2"
            placeholder="Keahlian atau kemampuan Anda"
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            />

          {/* TENTANG ANDA */}
            <textarea
            name="tentang_anda"
            value={formData.tentang_anda}
            onChange={handleChange}
            rows="3"
            placeholder="Tulis tentang Anda..."
            className="border border-gray-300 p-2 w-full mb-3 rounded"
            />

          {/* CV */}
            <div className="w-full mt-3 text-center">
            <p className="font-semibold text-gray-800 mb-1">
                Unggah CV (opsional)
            </p>
            <label className="bg-[#6b0000] text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-[#8b0000] transition shadow">
                Pilih file
                <input
                type="file"
                name="cv"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                />
            </label>
            <p className="text-xs text-gray-600 mt-1">Format: .pdf</p>
            </div>

          {/* TOMBOL AKSI */}
            <div className="flex justify-between w-full mt-6">
            <a
                href="/dashboardMHS"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600
                            text-white text-sm font-medium rounded-md px-4 py-2
                            hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
                <ArrowLeft className="w-4 h-4" /> Kembali
            </a>

            <button
                type="submit"
                className="bg-red-800 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-md text-sm transition"
            >
                Simpan Perubahan
            </button>
            </div>
        </form>
        </div>
    </div>
    );
}
