"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Mail, Phone, ArrowLeft } from "lucide-react";

export default function DetailPelamar() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [pelamar, setPelamar] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loker, setLoker] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [kategori, setKategori] = useState("semua");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/lowongan/pelamar/${id}`);
        const json = await res.json();

        if (json.success) {
          setPelamar(json.pelamar);
          setFiltered(json.pelamar); // default
          setLoker(json.lowongan);
        } else {
          console.error("Gagal memuat data:", json.message);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // === FILTER + SEARCH SYSTEM ===
  useEffect(() => {
    let data = [...pelamar];

    // Filter kategori
    if (kategori !== "semua") {
      data = data.filter((p) => p.status_pendaftaran === kategori);
    }

    // Search
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.nama_lengkap.toLowerCase().includes(q) ||
          String(p.nim).includes(q)
      );
    }

    setFiltered(data);
  }, [kategori, search, pelamar]);


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

      {/* === FILTER + SEARCH === */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          
          {/* FILTER */}
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="border rounded-lg p-2 text-gray-700"
          >
            <option value="semua">Semua Status</option>
            <option value="menunggu">Menunggu</option>
            <option value="diterima">Diterima</option>
            <option value="tidak">Ditolak</option>
          </select>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Cari berdasarkan NIM atau Nama..."
            className="border rounded-lg p-2 w-full md:w-1/2 text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* === STATISTIK === */}
        <div className="flex gap-4 text-sm text-gray-700 mb-8">
          <span>Menunggu: {pelamar.filter(p => p.status_pendaftaran === "menunggu").length}</span>
          <span>Diterima: {pelamar.filter(p => p.status_pendaftaran === "diterima").length}</span>
          <span>Ditolak: {pelamar.filter(p => p.status_pendaftaran === "tidak").length}</span>
        </div>


        {/* === LIST PELAMAR === */}
        {filtered.length === 0 ? (
          <p className="text-gray-500 border p-5 bg-white rounded-xl shadow text-center">
            Tidak ada pelamar.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((u) => (
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

                  <button
                    onClick={() => setSelectedUser(u)}
                    className="mt-4 w-full bg-[#800000] hover:bg-[#a00000] text-white py-2 rounded-lg transition font-semibold"
                  >
                    Detail Pelamar
                  </button>
                  {selectedUser && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Pelamar</h2>

                        <div className="space-y-3 text-gray-700">
                          <p><b>Nama:</b> {selectedUser.nama_lengkap}</p>
                          <p><b>NIM:</b> {selectedUser.nim}</p>
                          <p><b>Program Studi:</b> {selectedUser.prodi}</p>
                          <p><b>Email:</b> {selectedUser.email}</p>
                          <p><b>No Telepon:</b> {selectedUser.no_telephone}</p>
                          <p><b>Alamat:</b> {selectedUser.alamat}</p>
                          <p><b>tentang_anda:</b> {selectedUser.tentang_anda}</p>

                          {selectedUser.linkedin && (
                            <p>
                              <b>LinkedIn:</b>{" "}
                              <a href={selectedUser.linkedin} target="_blank" className="text-blue-600 underline">
                                {selectedUser.linkedin}
                              </a>
                            </p>
                          )}

                          {selectedUser.keahlian && (
                            <p><b>Keahlian:</b> {selectedUser.keahlian}</p>
                          )}

                          {selectedUser.tentang_anda && (
                            <p><b>Tentang Anda:</b> {selectedUser.tentang_anda}</p>
                          )}

                          {selectedUser.cv && (
                            <p>
                              <b>CV:</b>{" "}
                              <a
                                href={`/uploads/cv/${selectedUser.cv}`}
                                target="_blank"
                                className="text-green-700 underline font-semibold"
                              >
                                Lihat CV
                              </a>
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedUser(null)}
                          className="mt-6 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
