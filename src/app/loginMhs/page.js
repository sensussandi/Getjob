"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginMhs() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ nim: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      nim: formData.nim,
      password: formData.password,
      callbackUrl: "/dashboardMHS",
    });

    if (!res.ok) {
      alert("NIM atau password salah!");
      return;
    }

    const sessionRes = await fetch("/api/auth/session", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const session = await sessionRes.json();

    if (!session?.user?.nim) {
      alert("Gagal mengambil session!");
      return;
    }

    localStorage.setItem("nim", session.user.nim);
    localStorage.setItem("nama_lengkap", session.user.nama_lengkap);
    localStorage.setItem("email", session.user.email);

    window.location.href = "/dashboardMHS";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-900 p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Login Mahasiswa</h1>

        <label className="block mb-4">
          NIM
          <input
            type="text"
            name="nim"
            value={formData.nim}
            onChange={handleChange}
            className="w-full p-3 border rounded mt-1"
          />
        </label>

        <label className="block mb-6">
          Password
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded mt-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </label>

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-red-900 text-white rounded-lg"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}