"use client"; // Use client adalah directive untuk mengaktifkan fitur client-side rendering di Next.js
import { useState } from "react"; // Import useState dari React untuk mengelola state komponen
import { useSession } from "next-auth/react"; 

export default function ProfilePage() {
  // Function default untuk menampilkan halaman profil
    const [darkMode, setDarkMode] = useState(false);
    const { data: session } = useSession(); // ambil session user
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
    if (!session?.user?.nim) {
        alert("Anda belum login!");
        return;
        }
    const data = new FormData();
    data.append("nim", session.user.nim); // Kirim NIM dari session
    data.append("photo", formData.photo);
    data.append("prodi", formData.prodi);
    data.append("about", formData.about);
    data.append("cv", formData.cv);

    try {
        const res = await fetch("/api/profil", {
        method: "POST",
        body: data,
        });

        const result = await res.json();
        alert(result.success ? "Profil berhasil disimpan!" : `Gagal: ${result.message}`);
        console.log("Server response:", result);
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Tidak bisa terhubung ke server!");
    }
    };

    return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen flex flex-col items-center justify-center transition-all duration-300 px-4`}>
    
      {/* Judul */}
        <h1 className="text-3xl md:text-4xl font-semibold mb-8 text-center">Lengkapi Profile Anda</h1>

      {/* Form */}
        <form onSubmit={handleSubmit} className={`w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
        {/* FOTO PROFIL */}
        <div className="flex flex-col items-center">
            <label className="text-lg font-medium mb-2">Foto Profile</label>
            <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center mb-3 border border-gray-300 overflow-hidden">
            <img src={formData.photo ? URL.createObjectURL(formData.photo) : "/default-avatar.png"} alt="Preview" className="object-cover w-full h-full" />
            </div>
            <label className="cursor-pointer text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            style={{ backgroundColor: "#800000" }}>
            Pilih Foto
            <input type="file" name="photo" accept=".jpeg,.jpg,.png" onChange={handleChange} className="hidden" />
            </label>
            <p className="text-sm mt-1 text-gray-500">Format: .jpeg .jpg .png</p>
        </div>

        {/* PRODI */}
        <div>
            <label className="block text-lg font-medium mb-2">Prodi</label>
            <select name="prodi" value={formData.prodi} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600">
            <option value="">Pilih prodi Anda</option>
            <option value="Informatika">Informatika</option>
            <option value="Teknik Mesin">Teknik Mesin</option>
            <option value="Teknik Elektro">Teknik Elektro</option>
            <option value="Matematika">Matematika</option>
            </select>
        </div>

        {/* TENTANG ANDA */}
        <div>
            <label className="block text-lg font-medium mb-2">Tentang Anda</label>
            <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Tulis tentang Anda..."
            className="w-full h-28 border border-gray-300 rounded-md px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600"
            />
        </div>

        {/* CV */}
        <div className="flex flex-col items-center">
            <label className="text-lg font-medium mb-2">Masukkan CV Anda (opsional)</label>
            <div className="flex flex-col items-center">
            <label className="cursor-pointer text-white px-4 py-2 rounded-md hover:bg-orange-600 transition"
            style={{ backgroundColor: "#800000" }}>
                Pilih file
                <input type="file" name="cv" accept=".pdf" onChange={handleChange} className="hidden" />
            </label>
            <p className="text-sm mt-1 text-gray-500">Format: .pdf</p>
            </div>
        </div>

        {/* Tombol Selanjutnya */}
        <button type="submit" className="w-full bg-red-900 text-white py-3 rounded-md font-semibold hover:bg-orange-400 transition flex items-center justify-center gap-2">
            Selanjutnya <span>›</span>
        </button>
        </form>
    </div>
    );
}
