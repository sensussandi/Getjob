"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, CalendarDays, Briefcase } from "lucide-react";

export default function HasilCari() {
    const searchParams = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const lokasi = searchParams.get("lokasi") || "";
    const kategori = searchParams.get("kategori") || "";

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const url = `/api/cariLowongan?keyword=${keyword}&lokasi=${lokasi}&kategori=${kategori}`;
    fetch(url)
        .then((res) => res.json())
        .then((result) => setData(result.data || []))
        .finally(() => setLoading(false));
    }, [keyword, lokasi, kategori]);

    if (loading) return <p className="text-center py-10">Memuat hasil pencarian...</p>;

    return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-[#6b0000] mb-6 text-center">
            Hasil Pencarian Lowongan
        </h1>

        {data.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ditemukan hasil pencarian.</p>
        ) : (
            <div className="space-y-5">
            {data.map((item) => (
                <div key={item.id_lowongan} className="p-5 border rounded-xl shadow-sm hover:shadow-md transition bg-gradient-to-r from-white to-orange-50">
                <h2 className="text-lg font-semibold text-[#6b0000] mb-1">{item.nama_posisi}</h2>
                <p className="text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> {item.nama_perusahaan}
                </p>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {item.lokasi} |{" "}
                    <CalendarDays className="w-4 h-4" /> Tutup:{" "}
                    {new Date(item.tanggal_ditutup).toLocaleDateString("id-ID")}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                    <strong>Gaji:</strong> {item.gaji || "Tidak disebutkan"}
                </p>
                </div>
            ))}
            </div>
        )}
        </div>
    </div>
    );
}