"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Mail, Phone, ArrowLeft } from "lucide-react";

export default function DetailPelamar() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [pelamar, setPelamar] = useState([]);
  const [loker, setLoker] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/lowongan/pelamar?id_lowongan=${id}`);
      const json = await res.json();

      if (json.success) {
        setPelamar(json.pelamar);
        setLoker(json.lowongan);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  const getStatusBadge = (status) => {
    const styles = {
      menunggu: "bg-yellow-100 text-yellow-800 border-yellow-300",
      diterima: "bg-green-100 text-green-700 border-green-300",
      tidak: "bg-red-100 text-red-700 border-red-300",
    };
    return styles[status] || styles.menunggu;
  };

  if (loading)
    return <p className="p-10 text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-10">
      <div className="max-w-5xl mx-auto">

        {/* === BACK BUTTON === */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-[#800000] flex items-center gap-2 hover:underline font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>

        {/* === TITLE === */}
        <h1 className="text-3xl font-bold text-gray-900">
          {loker?.nama_posisi}
        </h1>

        <p className="text-gray-600 mt-1 mb-8">
          Total pelamar: <span className="font-semibold text-gray-900">{pelamar.length}</span>
        </p>

        <div className="flex gap-4 text-sm text-gray-700 mb-8">
          <span>Menunggu: {pelamar.filter(p => p.status_pendaftaran === "menunggu").length}</span>
          <span>Diterima: {pelamar.filter(p => p.status_pendaftaran === "diterima").length}</span>
          <span>Ditolak: {pelamar.filter(p => p.status_pendaftaran === "tidak").length}</span>
        </div>



        {/* === LIST PELAMAR === */}
        {pelamar.length === 0 ? (
          <p className="text-gray-500 border p-5 bg-white rounded-xl shadow text-center">
            Belum ada pelamar.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pelamar.map((u) => (
              <div
                key={u.nim}
                className="p-6 bg-white rounded-2xl border shadow-sm hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{u.nama_lengkap}</h3>
                    <p className="text-sm text-gray-500">{u.prodi}</p>
                  </div>

                  {/* STATUS BADGE */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusBadge(
                      u.status_pendaftaran
                    )}`}
                  >
                    {u.status_pendaftaran.charAt(0).toUpperCase() +
                      u.status_pendaftaran.slice(1)}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {u.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" /> {u.no_telephone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
