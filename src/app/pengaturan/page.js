"use client";
import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa"; // Import icon pensil dari dari FontAwesome
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icon mata untuk toggle password

export default function PengaturanPage() {
    const [formData, setFormData] = useState({
    nim: "", // Menambahkan nim untuk identifikasi user
    nama_lengkap: "",
    email: "",
    no_telephone: "",
    password: "",
    });

    const [showPassword, setShowPassword] = useState(false); // Untuk toggle visibilitas password

    // Ambil data user dari localStorage setelah login
    useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        setFormData({
        nim: user.nim,
        nama_lengkap: user.nama_lengkap || "",
        email: user.email || "",
        no_telephone: user.no_telephone || "",
        password:user.password || "",
        });
    }
  }, []); // Hanya dijalankan sekali saat halaman dibuka

  // Fungsi untuk menangani perubahan input
    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  // Fungsi untuk mengirim data ke API
    const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/pengaturan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert(data.message || "Pengaturan berhasil disimpan!");
    };

    return (
    <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">Pengaturan Akun</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Nama */}
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

        {/* Input Email */}
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

        {/* Input WhatsApp */}
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

        {/* Input Password */}
        <div className="relative">
            <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Ubah Kata Sandi"
            className="border border-gray-300 p-2 w-full pr-10 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
            />            
            <button // Tombol untuk toggle visibilitas password
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600"
            >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>

        {/* Tombol Simpan */}
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded w-full transition duration-300">
            Simpan Perubahan
        </button>
        </form>
    </div>
    );
}
