"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";  // <-- ini WAJIB ada

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    // sementara dummy login
    if (email && password) {
      console.log("Email:", email);
      console.log("Password:", password);
      alert("Login berhasil (dummy)");

      // redirect ke /home
      router.push("/home");
    } else {
      alert("Email atau password salah");
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}
