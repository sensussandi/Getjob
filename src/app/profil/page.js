"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
    prodi: "",
    tentang_anda: "",
    foto: null,
    cv: null,
    });

    useEffect(() => {
    const fetchProfile = async () => {
        try {
        const nim = session?.user?.nim;
        if (!nim) return;
        const res = await fetch(`/api/profil?nim=${nim}`);
        const data = await res.json();
        if (data.success) {
            setProfile(data.data);
            setFormData({
            prodi: data.data.prodi || "",
            tentang_anda: data.data.tentang_anda || "",
            foto: null,
            cv: null,
            });
        }
        } catch (err) {
        console.error("Gagal mengambil profil:", err);
        } finally {
        setLoading(false);
        }
    };

    if (session?.user?.nim) fetchProfile();
    }, [session]);

    const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
    };

    const handleSave = async () => {
    try {
        const form = new FormData();
        form.append("nim", session.user.nim);
        form.append("prodi", formData.prodi);
        form.append("about", formData.tentang_anda);
        if (formData.foto) form.append("photo", formData.foto);
        if (formData.cv) form.append("cv", formData.cv);

        const res = await fetch("/api/profil", {
        method: "POST",
        body: form,
        });

        const result = await res.json();
        if (result.success) {
        alert("Profil berhasil diperbarui!");
        setEditMode(false);
        setProfile((prev) => ({
            ...prev,
            prodi: formData.prodi,
            tentang_anda: formData.tentang_anda,
            foto: formData.foto ? formData.foto.name : prev.foto,
            cv: formData.cv ? formData.cv.name : prev.cv,
        }));
        } else {
        alert("Gagal memperbarui profil.");
        }
    } catch (error) {
        console.error("Error simpan profil:", error);
        alert("Terjadi kesalahan saat menyimpan profil.");
    }
    };

    if (status === "loading" || loading) return <div className="flex items-center justify-center h-screen text-[#6b0000] font-semibold">Memuat profil...</div>;

    if (!profile)
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">Data profil tidak ditemukan.</p>
        <Link href="/dashboardMHS" className="bg-[#6b0000] text-white px-5 py-2 rounded-lg shadow hover:bg-[#8b0000] transition">
            Kembali ke Dashboard
        </Link>
        </div>
    );

    return (
    <div className="min-h-screen bg-[#fff8f8] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-200">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#6b0000] to-[#b22c2c] text-white p-6 text-center">
            <h1 className="text-3xl font-bold tracking-wide">Profil Saya</h1>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col items-center p-8 bg-gradient-to-b from-orange-100 to-gray-100">
          {/* FOTO */}
            <div className="flex flex-col items-center mb-5">
            <img
                src={formData.foto ? URL.createObjectURL(formData.foto) : profile.foto ? `/uploads/${profile.foto}` : "/default-avatar.png"}
                alt="Foto Profil"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#6b0000] shadow-lg"
            />

            {editMode && (
                <div className="mt-4 text-center">
                <label className="bg-[#6b0000] text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-[#8b0000] transition shadow">
                    Pilih Foto
                    <input type="file" name="foto" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                </label>
                <p className="text-xs text-gray-600 mt-1">Format: .jpeg .jpg .png</p>
                </div>
            )}
            </div>

          {/* NAMA & PRODI */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-1">{session.user.name}</h2>
            {editMode ? (
            <select
                name="prodi"
                value={formData.prodi}
                onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                className="mt-2 w-60 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6b0000]"
            >
                <option value="">Pilih Prodi</option>
                <option value="Informatika">Informatika</option>
                <option value="Sistem Informasi">Sistem Informasi</option>
                <option value="Teknologi Informasi">Teknologi Informasi</option>
            </select>
            ) : (
            <p className="text-gray-600">{profile.prodi || "Prodi belum diisi"}</p>
            )}

          {/* TENTANG ANDA */}
            <div className="w-full mt-5">
            <p className="font-semibold text-gray-800 mb-1">Tentang Anda</p>
            {editMode ? (
                <textarea
                name="tentang_anda"
                value={formData.tentang_anda}
                onChange={(e) => setFormData({ ...formData, tentang_anda: e.target.value })}
                rows="3"
                placeholder="Tulis tentang Anda..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b0000]"
                />
            ) : (
                <p className="italic text-gray-700 bg-white border rounded-lg p-3 shadow-sm">{profile.tentang_anda || "Belum ada deskripsi"}</p>
            )}
            </div>

          {/* CV */}
            <div className="w-full mt-5 text-center">
            <p className="font-semibold text-gray-800 mb-1">Masukkan CV Anda (opsional)</p>
            {editMode ? (
                <div>
                <label className="bg-[#6b0000] text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-[#8b0000] transition shadow">
                    Pilih file
                    <input type="file" name="cv" accept=".pdf" onChange={handleFileChange} className="hidden" />
                </label>
                <p className="text-xs text-gray-600 mt-1">Format: .pdf</p>
                </div>
            ) : profile.cv ? (
                <a href={`/uploads/${profile.cv}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Lihat CV Saya
                </a>
            ) : (
                <p className="text-gray-500 text-sm">Belum mengunggah CV</p>
            )}
            </div>

          {/* BUTTONS */}
            <div className="flex justify-between w-full mt-8">
            <Link
                href="/dashboardMHS"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600
                            text-white text-sm font-medium rounded-md px-4 py-2
                            hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
                <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>

            {!editMode ? (
                <button onClick={() => setEditMode(true)} className="flex items-center gap-1 bg-[#6b0000] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#8b0000] transition">
                <Pencil className="w-4 h-4" /> Edit Profil
                </button>
            ) : (
                <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition">
                    <Save className="w-4 h-4" /> Simpan
                </button>
                <button onClick={() => setEditMode(false)} className="flex items-center gap-1 bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition">
                    <X className="w-4 h-4" /> Batal
                </button>
                </div>
            )}
            </div>
        </div>
        </div>
    </div>
    );
}