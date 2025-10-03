"use client";

import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection"; // import HeroSection


export default function Home() {
  
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tambah user
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "" });
    fetchUsers();
  };

  return (
    <div className="min-h-[200vh] bg-white">
      {/* Hero Section di bagian atas */}
      <HeroSection />
      
    
    <div style={{ padding: "20px" }}>
      <h1>Frontend Next.js</h1>
      <h2>Ambil Data dari Backend Express:</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} ({u.email})
            </li>
          ))}
        </ul>
      )}

      <h2>Tambah User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">Tambah</button>
      </form>
    </div>
    </div>
  );
}
