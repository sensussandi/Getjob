"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Briefcase, Building2, CalendarDays, Clock } from "lucide-react";

// Halaman untuk menampilkan lowongan yang sudah didaftarkan oleh user
export default function LokerSaya() {
    const { data: session, status } = useSession();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (status === "authenticated" && session?.user?.nim) {
        fetch(`/api/lihatLokerSaya?nim=${session.user.nim}`)
        .then((res) => res.json())
        .then((result) => {
            if (result.success) setData(result.data);
        })
        .catch((err) => console.error("Error ambil data:", err))
        .finally(() => setLoading(false));
    }
    }, [session, status]);

    if (status === "loading" || loading) return <div className="text-center py-20 text-gray-500">Memuat data pendaftaran...</div>;

    if (!session?.user)
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-700 mb-3">Anda belum login.</p>
        <a href="/loginMhs" className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition">
            Ke Halaman Login
        </a>
        </div>
    );

    return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-gray-100 py-10 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-[#6b0000] mb-8">Loker yang Anda Daftarkan</h1>

        {data.length === 0 ? (
            <p className="text-center text-gray-600">Belum ada lowongan yang Anda daftar.</p>
        ) : (
            <div className="space-y-6">
            {data.map((item) => (
                <div key={item.id_pendaftaran} className="p-5 border rounded-xl shadow-sm bg-gradient-to-r from-white to-orange-50 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#6b0000]">{item.nama_posisi}</h2>
                    <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status_pendaftaran === "diterima" ? "bg-green-100 text-green-700" : item.status_pendaftaran === "tidak" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                    >
                    {item.status_pendaftaran}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                    <p className="text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> {item.nama_perusahaan}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2 mt-1 sm:mt-0">
                    <CalendarDays className="w-4 h-4" /> {new Date(item.tanggal_daftar).toLocaleDateString("id-ID")}
                    </p>
                </div>

                <div className="flex justify-between mt-3 text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> Lokasi: {item.lokasi}
                    </p>
                    <p className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Tutup: {new Date(item.tanggal_ditutup).toLocaleDateString("id-ID")}
                    </p>
                </div>

                <p className="mt-3 text-gray-700">
                    <strong>Gaji:</strong> {item.gaji || "Tidak disebutkan"}
                </p>
                </div>
            ))}
            </div>
        )}
        <button className="mt-8 w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 transition">
            Kembali
        </button>
        </div>
    </div>
    );
}