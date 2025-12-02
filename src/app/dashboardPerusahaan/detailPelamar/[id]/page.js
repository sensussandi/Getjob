"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, FileText, MapPin, Calendar, Briefcase } from "lucide-react";

export default function DetailPelamar() {
  const router = useRouter();
  const { id } = useParams();
  const [pelamar, setPelamar] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/perusahaan/detailPelamar?id_mendaftar=${id}`);
      const data = await res.json();
      if (data.success) setPelamar(data.data);
    };

    fetchData();
  }, [id]);

  if (!pelamar)
    return <div className="p-10 text-center">Memuat data pelamar...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#800000] mb-6 font-semibold"
      >
        <ArrowLeft /> Kembali
      </button>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Detail Pelamar
        </h1>

        {/* Foto */}
        <div className="flex justify-center mb-6">
          <img
            src={pelamar.foto ? `/uploads/foto/${pelamar.foto}` : "/default-user.jpg"}
            className="w-32 h-32 rounded-full object-cover shadow"
            alt="Foto Pelamar"
          />
        </div>

        {/* Nama */}
        <Info icon={<User />} label="Nama Lengkap" value={pelamar.nama_lengkap} />

        {/* Email */}
        <Info icon={<Mail />} label="Email" value={pelamar.email} />

        {/* Telepon */}
        <Info icon={<Phone />} label="No. Telepon" value={pelamar.no_telephone} />

        {/* Alamat */}
        <Info icon={<MapPin />} label="Alamat" value={pelamar.alamat} />

        {/* Prodi */}
        <Info icon={<Briefcase />} label="Prodi" value={pelamar.prodi} />

        {/* Pendidikan */}
        <Info icon={<Calendar />} label="Pendidikan Terakhir" value={pelamar.pendidikan_terakhir} />

        {/* Tentang Anda */}
        <Info icon={<User />} label="Tentang Pelamar" value={pelamar.tentang_anda} />

        {/* CV */}
        <div className="mt-4">
          <span className="font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            CV Pelamar:
          </span>
          <a
            href={`/uploads/cv/${pelamar.cv}`}
            target="_blank"
            className="text-[#800000] underline ml-7"
          >
            Lihat CV
          </a>
        </div>

      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="text-gray-700">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
