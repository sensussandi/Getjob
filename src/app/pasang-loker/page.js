"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle, Briefcase } from "lucide-react";

export default function PasangLokerPage() {
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false);

  useEffect(() => {
    // Ambil role dari localStorage (pastikan saat login tersimpan)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "perusahaan" || user.role === "admin_perusahaan") {
        setIsCompanyAdmin(true);
      }
    }
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#800000] via-[#900000] to-[#700000] text-white py-16">
      <div className="max-w-screen-xl mx-auto px-6">

        {/* === Header Section === */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4">
            Pasang <span className="text-yellow-400">Iklan Lowongan Kerja</span>
          </h1>

          {/* ✅ Ganti teks menjadi tombol hanya untuk admin perusahaan */}
          {isCompanyAdmin ? (
            <a
              href="/dashboardPerusahaan/pasangLoker"
              className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-xl text-lg shadow-lg transition-all transform hover:scale-[1.05]"
            >
              <Briefcase className="w-6 h-6" />
              Pasang Loker Sekarang
            </a>
          ) : (
            <p className="text-lg text-red-100 max-w-2xl mx-auto">
              Temukan kandidat terbaik untuk perusahaan Anda melalui platform rekrutmen
              <br /> <b>USD GetJob</b> — cepat, mudah, dan terpercaya!
            </p>
          )}
        </div>

        {/* === Feature Cards Section === */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Job Posting",
              desc: "Pasang lowongan kerja dan jangkau ribuan mahasiswa aktif di seluruh Indonesia.",
            },
            {
              title: "Applicant Tracking System",
              desc: "Pantau dan kelola lamaran kandidat langsung dari dashboard perusahaan Anda.",
            },
            {
              title: "Talent Search",
              desc: "Temukan talenta terbaik dengan filter lokasi, jurusan, dan keterampilan spesifik.",
            },
            {
              title: "Candidate Recommendation",
              desc: "Sistem kami membantu merekomendasikan kandidat paling cocok untuk posisi Anda.",
            },
            {
              title: "Career Page",
              desc: "Bangun citra perusahaan yang menarik dengan halaman profil karier profesional.",
            },
            {
              title: "Support 24/7",
              desc: "Tim kami siap membantu Anda kapan pun melalui WhatsApp dan email.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white text-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-[#800000]" />
                <h3 className="text-xl font-semibold text-[#800000]">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* === Call to Action Section === */}
        <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 md:w-2/3">
            <h2 className="text-3xl font-bold text-[#800000]">
              Siap Pasang Lowongan Sekarang?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Dengan USD GetJob, Anda dapat menjangkau ribuan mahasiswa dan lulusan aktif
              dari berbagai jurusan di Universitas Sanata Dharma dan kampus mitra lainnya.
              Posting iklan Anda sekarang dan temukan talenta terbaik tanpa proses rumit.
            </p>
          </div>

          {/* Tombol WhatsApp */}
          <a
            href="https://wa.me/628562906005"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-[#1DA851] transition-all transform hover:scale-[1.05]"
          >
            <MessageCircle className="w-6 h-6" />
            Hubungi Kami via WhatsApp
          </a>
        </div>

        {/* === Trusted By Section === */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-yellow-400 mb-4">
            Dipercaya oleh berbagai perusahaan ternama
          </h3>
          <div className="flex flex-wrap justify-center gap-6 opacity-90">
            <img src="/logos/ef.png" alt="EF" className="h-10" />
            <img src="/logos/homecredit.png" alt="Home Credit" className="h-10" />
            <img src="/logos/united.png" alt="United Tractors" className="h-10" />
            <img src="/logos/bankmega.png" alt="Bank Mega" className="h-10" />
            <img src="/logos/oqo.png" alt="OQO" className="h-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
