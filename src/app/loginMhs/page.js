"use client";
import { useState } from "react";
import { User, Lock, Eye, EyeOff, GraduationCap, X } from "lucide-react";

export default function LoginMhs() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ nim: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.nim || !formData.password) {
      alert("NIM dan Password harus diisi!");
      return;
    }

    try {
      const response = await fetch("/api/loginMhs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("user", JSON.stringify(result.data));

        // ⏳ Delay kecil agar data tersimpan sempurna sebelum redirect
        setTimeout(() => {
          window.location.replace("/dashboardMHS");
        }, 500);
      } else {
        alert(result.message || "Login gagal!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Tidak bisa terhubung ke server!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-xl mb-4">
            <GraduationCap className="w-12 h-12 text-red-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Portal Mahasiswa</h1>
          <p className="text-red-100">Silakan login untuk melanjutkan</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">NIM</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                placeholder="Masukkan NIM"
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-900"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan Password"
                className="w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-red-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-red-900 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
          >
            Masuk
          </button>
        </div>
      </div>
    </div>
  );
}
