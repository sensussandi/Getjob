"use client";
import { useState } from "react";
import { User, Lock, Eye, EyeOff, GraduationCap, X } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginMhs() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    nim: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.nim || !formData.password) {
      alert("NIM dan Password harus diisi!");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      nim: formData.nim,
      password: formData.password,
      callbackUrl: "/dashboardMHS",
    });

    if (!res.ok) {
      alert("NIM atau Password salah!");
      return;
    }

    window.location.href = "/dashboardMHS";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 flex items-center justify-center px-4 py-12">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-xl mb-4">
            <GraduationCap className="w-12 h-12 text-red-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Portal Mahasiswa
          </h1>
          <p className="text-red-100">Silakan login untuk melanjutkan</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Login
            </h2>

            {/* NIM */}
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
                  className="w-full pl-12 pr-4 py-3 border text-black rounded-lg focus:ring-2 focus:ring-red-900 transition"
                />
              </div>
            </div>

            {/* PASSWORD */}
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
                  className="w-full pl-12 pr-12 py-3 border text-black rounded-lg focus:ring-2 focus:ring-red-900 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* REMEMBER ME + LUPA SANDI */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-red-900"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Ingat Saya
                </span>
              </label>

              <button className="text-sm text-red-900 hover:text-red-700">
                Lupa Kata Sandi?
              </button>
            </div>

            {/* LOGIN */}
            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full bg-red-900 text-white py-3 rounded-lg font-semibold hover:bg-red-800 transition"
              >
                Masuk
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-white text-gray-700 py-3 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Batal
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <a
                  href="/registrasiMHS"
                  className="text-red-900 font-semibold hover:text-red-700"
                >
                  Daftar di sini
                </a>
              </p>
            </div>
          </div>
        </div>

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