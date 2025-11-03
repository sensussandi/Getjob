"use client"; // Use client adalah directive untuk mengaktifkan fitur client-side rendering di Next.js
import { useState } from "react"; // Import useState dari React untuk mengelola state komponen

export default function ProfilePage() {
  // Function default untuk menampilkan halaman profil
    const [darkMode, setDarkMode] = useState(false);
    const [formData, setFormData] = useState({
    photo: null,
    prodi: "",
    about: "",
    cv: null,
    });

    const handleChange = (e) => {
    // Function untuk menangani perubahan input form
    const { name, value, files } = e.target;
    setFormData({
        ...formData,
        [name]: files ? files[0] : value,
    });
    };

    const handleSubmit = async (e) => {
    // Function untuk menangani submit form
    e.preventDefault();
    const data = new FormData();
    data.append("photo", formData.photo);
    data.append("prodi", formData.prodi);
    data.append("about", formData.about);
    data.append("cv", formData.cv);

    const res = await fetch("/api/profil", {
      // Kirim data ke endpoint /api/profile
        method: "POST",
        body: data,
    });
    alert(res.ok ? "Profil berhasil dikirim!" : "Gagal mengirim data!");
    };

    return (
    // Render halaman profil
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen flex flex-col items-center justify-center transition-all duration-300`}>
        <div className="absolute top-5 right-5">
        <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        </div>

        <h1 className="text-3xl font-bold mb-6">Lengkapi profile anda</h1>

        <form onSubmit={handleSubmit} className={`profile-form ${darkMode ? "dark" : ""}`}>
        {/* FOTO */}
        <label>Foto Profile</label>
        <input type="file" name="photo" accept=".jpeg,.jpg,.png" onChange={handleChange} />
        <p>Format: .jpeg .jpg .png</p>

        {/* PRODI */}
        <label>Prodi</label>
        <select name="prodi" value={formData.prodi} onChange={handleChange}>
            <option value="">Pilih prodi anda</option>
            <option value="Informatika">Informatika</option>
            <option value="Sistem Informasi">Sistem Informasi</option>
            <option value="Teknik Elektro">Teknik Elektro</option>
        </select>

        {/* TENTANG ANDA */}
        <label>Tentang anda</label>
        <textarea name="about" value={formData.about} onChange={handleChange} placeholder="Tulis tentang anda..." />

        {/* CV */}
        <label>Masukkan CV anda (opsional)</label>
        <input type="file" name="cv" accept=".pdf" onChange={handleChange} />
        <p>Format: .pdf</p>

        <button type="submit" className="btn-next">
            Selanjutnya
        </button>
        </form>
    </div>
    );
}
