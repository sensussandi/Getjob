"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Users, Mail, Phone, ArrowLeft } from "lucide-react";

export default function DetailPelamar() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [pelamar, setPelamar] = useState([]);
  const [loker, setLoker] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/lowongan/detail?id_lowongan=${id}`);
      const json = await res.json();

      if (json.success) {
        setPelamar(json.pelamar);
        setLoker(json.lowongan);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-8">

      <button
        onClick={() => router.back()}
        className="mb-6 text-[#800000] flex items-center gap-2 hover:underline"
      >
        <ArrowLeft /> Kembali
      </button>

      <h1 className="text-3xl font-bold mb-2">{loker?.nama_posisi}</h1>
      <p className="text-gray-600 mb-6">
        Daftar pencari kerja yang melamar lowongan ini
      </p>

      {pelamar.length === 0 ? (
        <p className="text-gray-500">Belum ada pelamar.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pelamar.map((u) => (
            <div key={u.nim} className="border p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg">{u.nama_lengkap}</h3>
              <p className="text-sm text-gray-500 mb-2">{u.prodi}</p>

              <div className="text-sm text-gray-700 space-y-1">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {u.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {u.no_telephone}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
