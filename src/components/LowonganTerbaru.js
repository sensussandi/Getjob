"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function LowonganTerbaru() {
  const { data: session, status } = useSession();

  const [lowongan, setLowongan] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // ---------- LOAD LOWONGAN ----------
  useEffect(() => {
    const fetchLowongan = async () => {
      const res = await fetch("/api/lowongan", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setLowongan(data.data);
      setLoading(false);
    };
    fetchLowongan();
  }, []);

  // ---------- CEK STATUS SESSION ----------
  if (status === "loading") {
    return <div className="text-center py-20">Memuat...</div>;
  }

  const handleApply = async (job) => {
    if (!session || !session.user?.nim) {
      alert("Silakan login terlebih dahulu!");
      window.location.href = "/loginMHS";
      return;
    }

  const res = await fetch("/api/lamaran/kirim", {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id_lowongan: job.id_lowongan,
    nim: session.user.nim,
  }),
});

    const result = await res.json();
    alert(result.message);
    setShowModal(false);
  };

  const handleOpenModal = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  return (
    <section className="py-10">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lowongan.map((job) => (
          <div key={job.id_lowongan} className="border p-4 rounded-xl">
            <h2 className="font-bold text-lg">{job.nama_posisi}</h2>
            <p>{job.nama_perusahaan}</p>

            {!job.external_url ? (
              <button
                onClick={() => handleOpenModal(job)}
                className="mt-4 w-full bg-red-900 text-white py-2 rounded"
              >
                Lamar Sekarang
              </button>
            ) : (
              <a
                href={job.external_url}
                target="_blank"
                className="mt-4 w-full bg-red-900 text-white py-2 rounded block text-center"
              >
                Lamar Sekarang
              </a>
            )}
          </div>
        ))}
      </div>

      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">Konfirmasi Lamaran</h2>
            <p>
              Lamar posisi <b>{selectedJob.nama_posisi}</b> di{" "}
              <b>{selectedJob.nama_perusahaan}</b>?
            </p>

            <div className="mt-5 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border"
              >
                Batal
              </button>

              <button
                onClick={() => handleApply(selectedJob)}
                className="px-4 py-2 rounded bg-red-900 text-white"
              >
                Ya, Lamar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}