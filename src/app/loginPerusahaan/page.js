"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Mail, Lock } from "lucide-react";

export default function LoginPerusahaan() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/perusahaan/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem("perusahaan", JSON.stringify(data.perusahaan));
      router.push("/dashboardPerusahaan");
    } else {
      setError(data.message || "Login gagal. Coba lagi.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#7a0d0d] via-[#8b0000] to-[#b22222]">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-[90%] max-w-md">
        {/* === Header === */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-[#b22222] p-3 rounded-full mb-3">
            <Building2 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#7a0d0d]">Portal Perusahaan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Silakan login untuk melanjutkan
          </p>
        </div>

        {/* === Form === */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Perusahaan
            </label>
            <div className="flex items-center border rounded-lg px-3">
              <Mail className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="email"
                placeholder="Masukkan email perusahaan"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full py-2 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="flex items-center border rounded-lg px-3">
              <Lock className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full py-2 outline-none"
                required
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
              {error}
            </p>
          )}

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-red-600" />
              <span>Ingat Saya</span>
            </label>
            <a href="#" className="text-[#b22222] hover:underline">
              Lupa Kata Sandi?
            </a>
          </div>

          {/* Tombol */}
          <button
            type="submit"
            className="w-full bg-[#7a0d0d] hover:bg-[#5c0a0a] text-white py-2 rounded-lg font-semibold transition-all"
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold transition-all"
          >
            ✕ Batal
          </button>
        </form>

        <p className="text-center text-xs mt-4 text-gray-400">
          Butuh bantuan? Hubungi{" "}
          <span className="font-semibold text-[#7a0d0d]">
            admin@getjob.co.id
          </span>
        </p>
      </div>
    </div>
  );
}
