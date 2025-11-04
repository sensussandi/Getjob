"use client";
import { useState } from "react";

export default function PasangLokerPage() {
  const [formData, setFormData] = useState({
    nama_posisi: "",
    tanggal_dibuka: "",
    tanggal_ditutup: "",
    deskripsi_pekerjaan: "",
    kualifikasi: "",
    gaji: "",
    lokasi: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/pasang-loker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      setFormData({
        nama_posisi: "",
        tanggal_dibuka: "",
        tanggal_ditutup: "",
        deskripsi_pekerjaan: "",
        kualifikasi: "",
        gaji: "",
        lokasi: "",
      });
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-red-800 mb-8">
        🧾 Form Pasang Loker
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="nama_posisi"
          value={formData.nama_posisi}
          onChange={handleChange}
          placeholder="Nama Posisi"
          className="border border-gray-300 p-2 w-full rounded"
          required
        />

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="text-sm text-gray-600">Tanggal Dibuka</label>
            <input
              type="date"
              name="tanggal_dibuka"
              value={formData.tanggal_dibuka}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="text-sm text-gray-600">Tanggal Ditutup</label>
            <input
              type="date"
              name="tanggal_ditutup"
              value={formData.tanggal_ditutup}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
        </div>

        <textarea
          name="deskripsi_pekerjaan"
          value={formData.deskripsi_pekerjaan}
          onChange={handleChange}
          placeholder="Deskripsi Pekerjaan"
          className="border border-gray-300 p-2 w-full rounded h-28"
          required
        />

        <textarea
          name="kualifikasi"
          value={formData.kualifikasi}
          onChange={handleChange}
          placeholder="Kualifikasi / Syarat Pelamar"
          className="border border-gray-300 p-2 w-full rounded h-24"
        />

        <input
          type="text"
          name="gaji"
          value={formData.gaji}
          onChange={handleChange}
          placeholder="Gaji (opsional)"
          className="border border-gray-300 p-2 w-full rounded"
        />

        <input
          type="text"
          name="lokasi"
          value={formData.lokasi}
          onChange={handleChange}
          placeholder="Lokasi Kerja"
          className="border border-gray-300 p-2 w-full rounded"
        />

        <button
          type="submit"
          className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded w-full font-semibold transition"
        >
          Pasang Loker
        </button>
      </form>
    </div>
  );
}
