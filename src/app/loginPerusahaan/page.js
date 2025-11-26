"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, User, Lock, Eye, EyeOff } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

export default function LoginPerusahaan() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // State untuk checkbox "Ingat Saya"  
  const router = useRouter();
  const { data: session, status } = useSession();

  //  AUTO REDIRECT jika sudah login
  useEffect(() => {
    if (status === "loading") return; // tunggu session selesai dicek

    if (session?.user?.role === "admin") {
      router.push("/dashboardPerusahaan");
    } else if (session?.user?.role === "super_admin") {
      router.push("/dashboardAdmin");
    }
  }, [session, status]);

  useEffect(() => {
    // Ambil data remember me
    const saved = JSON.parse(localStorage.getItem("rememberMePerusahaan") || localStorage.getItem("rememberMeAdmin"));
    if (saved) {
      setForm({
        email: saved.email,
        password: saved.password,
      });
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // LOGIN ADMIN PERUSAHAAN
    let res = await signIn("admin", {
      redirect: false,
      email: form.email,
      password: form.password,
      rememberMe: rememberMe,
    });

    // Jika gagal admin → coba super_admin
    if (res?.error) {
      res = await signIn("super_admin", {
        redirect: false,
        email: form.email,
        password: form.password,
        rememberMe: rememberMe,
      });
    }

    if (res?.error) {
      setError("Email atau password salah!");
      return;
    }

    // Ambil session
    const currentsession = await fetch("/api/auth/session").then(r => r.json());
    localStorage.removeItem("rememberMeMHS");
    // Redirect sesuai role
    if (currentsession?.user?.role === "admin") {
      if (rememberMe) {
        localStorage.setItem(
          "rememberMePerusahaan",
          JSON.stringify({
            email: form.email,
            password: form.password,
          })
        );
        localStorage.removeItem("rememberMeAdmin");
      } else {
        localStorage.removeItem("rememberMePerusahaan");
      }
      router.push("/dashboardPerusahaan");
    }
    else if (currentsession?.user?.role === "super_admin") {
      if (rememberMe) {
        localStorage.setItem(
          "rememberMeAdmin",
          JSON.stringify({
            email: form.email,
            password: form.password,
          })
        );
        localStorage.removeItem("rememberMePerusahaan");
      } else {
        localStorage.removeItem("rememberMeAdmin");
      }
      router.push("/dashboardAdmin");
    }
    else {
      setError("Akses tidak diizinkan.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#7a0d0d] via-[#8b0000] to-[#b22222]">
      <div className="w-full max-w-md px-4">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-6 text-white">
          <div className="bg-white p-4 rounded-full mb-4">
            <Building2 className="text-[#7a0d0d] w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold">Portal Perusahaan</h1>
          <p className="text-white/90 text-sm mt-1">
            Silakan login untuk melanjutkan
          </p>
        </div>

        {/* CARD FORM */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Perusahaan
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Masukkan email perusahaan"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border text-black placeholder-gray-300 rounded-lg outline-none focus:border-[#7a0d0d] focus:ring-1 focus:ring-[#7a0d0d] transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border text-black placeholder-gray-300 rounded-lg outline-none focus:border-[#7a0d0d] focus:ring-1 focus:ring-[#7a0d0d] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </p>
            )}

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-red-900 border-gray-300 rounded focus:ring-2 focus:ring-red-900" />
                <span className="ml-2 text-sm text-gray-700">Ingat Saya</span>
              </label>
              <a href="#" className="text-[#7a0d0d] hover:underline">
                Lupa Kata Sandi?
              </a>
            </div>

            {/* Tombol */}
            <button
              type="submit"
              className="w-full bg-[#7a0d0d] hover:bg-[#5c0a0a] text-white py-3 rounded-lg font-semibold transition-all shadow-md"
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <span className="text-lg">✕</span>
              <span>Batal</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-6 text-white">
          Butuh bantuan? Hubungi{" "}
          <span className="font-semibold underline">admin@getjob.co.id</span>
        </p>
      </div>
    </div>
  );
}
