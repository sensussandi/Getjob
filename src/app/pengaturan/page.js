"use client";
import { useState, useEffect } from "react";
import { FaPen, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function PengaturanPage() {
    const { data: session, status } = useSession();

    const [formData, setFormData] = useState({
    nim: "",
    nama_lengkap: "",
    email: "",
    no_telephone: "",
    password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

  // Ambil data user dari database setelah session valid
    useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!session?.user?.nim) return;
        const res = await fetch(`/api/pengaturan?nim=${session.user.nim}`);
        const data = await res.json();

        if (data.success && data.user) {
          setFormData({
            nim: data.user.nim,
            nama_lengkap: data.user.nama_lengkap || "",
            email: data.user.email || "",
            no_telephone: data.user.no_telephone || "",
            password: data.user.password || "",
          });
        } else {
          console.warn("Data user tidak ditemukan:", data.message);
        }
      } catch (err) {
        console.error("Gagal memuat data user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUser();
    }
    }, [session, status]);

  // Handle perubahan input
    const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Simpan perubahan ke database
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch("/api/pengaturan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        });
        const result = await res.json();

        if (result.success) {
        alert("Pengaturan berhasil diperbarui!");
        } else {
        alert("Gagal memperbarui pengaturan.");
        }
    } catch (error) {
        console.error("Error saat menyimpan:", error);
        alert("Terjadi kesalahan saat menyimpan data.");
    }
    };

  // Jika data masih dimuat
    if (status === "loading" || loading) {
    return (
        <div className="flex justify-center items-center h-screen text-green-700 font-semibold">
        Memuat data akun...
        </div>
    );
    }

  // Jika user belum login
    if (!session?.user) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-600 mb-4">Anda belum login.</p>
        <a
            href="/loginMhs"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
            Ke Halaman Login
        </a>
        </div>
    );
    }

    return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-2xl mt-10 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
        Pengaturan Akun
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nama Lengkap */}
        <div className="relative">
            <input
            name="nama_lengkap"
            value={formData.nama_lengkap}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            className="border border-gray-300 p-2 w-full pr-10 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <FaPen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 cursor-pointer transition duration-200" />
        </div>

        {/* Email */}
        <div className="relative">
            <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border border-gray-300 p-2 w-full pr-10 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <FaPen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 cursor-pointer transition duration-200" />
        </div>

        {/* Nomor WhatsApp */}
        <div className="relative">
            <input
            name="no_telephone"
            value={formData.no_telephone}
            onChange={handleChange}
            placeholder="Nomor WhatsApp"
            className="border border-gray-300 p-2 w-full pr-10 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <FaPen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 cursor-pointer transition duration-200" />
        </div>

        {/* Password */}
        <div className="relative">
            <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Ubah Kata Sandi"
            className="border border-gray-300 p-2 w-full pr-10 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
            >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>

        {/* Tombol Kembali */}
        <a
            href="/dashboardMHS"
            className="inline-flex items-center justify-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600
                        text-white text-xs font-medium rounded-md px-3 py-1.5 shadow-sm
                        hover:from-orange-600 hover:to-orange-700 transition-all duration-200 focus:ring-2 focus:ring-orange-400"
        >
            ← Kembali
        </a>

        {/* Tombol Simpan */}
        <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded w-full transition duration-300 shadow"
        >
            Simpan Perubahan
        </button>
        </form>
    </div>
    );
} 