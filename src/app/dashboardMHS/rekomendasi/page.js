"use client";
import usePencakerAuth from "@/hooks/usePencakerAuth";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HasilRekomendasi() {
  usePencakerAuth();
  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");  // State untuk error
  const [resetting, setResetting] = useState(false); // State untuk tombol reset
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || session.user.role !== "alumni") return;

    const fetchRekomendasi = async () => {
      try {
        const res = await fetch(`/api/pencari_kerja/rekomendasi?nim=${session.user.id}`);
        const data = await res.json();

        if (data.emptySkill) {
          router.push("/dashboardMHS/rekomendasi/rekomendasiLoker");  // Mengarahkan ke halaman rekomendasi
          return;
        }

        setLowongan(data.lowongan || []);
      } catch (err) {
        console.error("Gagal memuat rekomendasi:", err);
        setError("Terjadi kesalahan saat memuat rekomendasi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRekomendasi();
  }, [session, router]);

  const handleResetKeahlian = async () => {
    setResetting(true);
    try {
      const res = await fetch(`/api/pencari_kerja/rekomendasi?nim=${session.user.id}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setError('Keahlian berhasil direset.');
        // Mengarahkan kembali ke halaman rekomendasi
        router.push('/dashboardMHS/rekomendasi/rekomendasiLoker');
      } else {
        setError('Gagal mereset keahlian.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mereset keahlian.');
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 py-10">Memuat rekomendasi lowongan...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600 py-10">{error}</p>;  // Menampilkan error jika ada
  }

  if (lowongan.length === 0) {
    return (
      <div className="text-center py-20 text-gray-700">
        <h2 className="text-xl font-semibold mb-2">Belum ada rekomendasi lowongan 😔</h2>
        <p>Silakan periksa kembali keahlian dan minat Anda.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-red-900 mb-6 text-center">
        💼 Rekomendasi Lowongan Untuk Anda
      </h1>

      <button
        onClick={handleResetKeahlian}
        className="mb-6 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 transition"
        disabled={resetting}
      >
        {resetting ? 'Mengatur ulang...' : 'Reset Rekomendasi Loker'}
      </button>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lowongan.map((job) => (
          <div
            key={job.id_lowongan}
            className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition"
          >
            <h2 className="text-xl font-bold text-red-800 mb-2">{job.nama_posisi}</h2>
            <p className="text-gray-700 text-sm mb-3">
              <strong>Perusahaan:</strong> {job.nama_perusahaan}
            </p>
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {job.deskripsi_pekerjaan}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              <strong>Lokasi:</strong> {job.lokasi}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              <strong>Gaji:</strong> {job.gaji}
            </p>
            <a
              href={`/lowongan/${job.id_lowongan}`}
              className="inline-block bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Lihat Detail
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
