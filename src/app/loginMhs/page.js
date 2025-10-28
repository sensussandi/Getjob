"use client";
import { useState } from "react";
import { User, Lock, Eye, EyeOff, GraduationCap, X } from "lucide-react";

export default function LoginMhs() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nim: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
        // Simpan seluruh data user ke localStorage
        localStorage.setItem("user", JSON.stringify(result.data));

        alert("Login berhasil!");
        window.location.href = "/dashboardMHS";
      } else {
        alert(result.message || "Login gagal!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Tidak bisa terhubung ke server!");
    }
  };


  const handleForgotPassword = () => {
    const email = prompt("Masukkan email Anda untuk reset password:");
    if (email) {
      alert(`Link reset password telah dikirim ke ${email}`);
      setShowForgotPassword(false);
    }
  };

  const handleCancel = () => {
    // Langsung redirect ke home tanpa konfirmasi
    window.location.href = '/';
    // Atau jika menggunakan Next.js router:
    // router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 flex items-center justify-center px-4 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Icon Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-xl mb-4">
            <GraduationCap className="w-12 h-12 text-red-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Portal Mahasiswa</h1>
          <p className="text-red-100">Silakan login untuk melanjutkan</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Login
            </h2>

            {/* NIM Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIM
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nim"
                  value={formData.nim}
                  onChange={handleChange}
                  placeholder="Masukkan NIM"
                  className="w-full pl-12 pr-4 py-3 border text-black placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan Password"
                  className="w-full pl-12 pr-12 py-3 border text-black placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-900 border-gray-300 rounded focus:ring-2 focus:ring-red-900"
                />
                <span className="ml-2 text-sm text-gray-700">Ingat Saya</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-red-900 hover:text-red-700 font-medium transition"
              >
                Lupa Kata Sandi?
              </button>
            </div>

            {/* Login Button */}
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full bg-red-900 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                Masuk
              </button>
              <button
                onClick={handleCancel}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Batal
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <button className="text-red-900 font-medium hover:text-red-700 transition">
                Daftar Sekarang
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-red-100 text-sm">
            Butuh bantuan? Hubungi{" "}
            <span className="font-semibold">admin@university.ac.id</span>
          </p>
        </div>
      </div>
    </div>
  );
}