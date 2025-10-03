export default function HomePage() {
  const jobs = [
    {
      id: 1,
      perusahaan: "Rais Eatery",
      posisi: "Chef",
      lokasi: "Kudus",
      tipe: "Full Time",
      gaji: "Rp 3,5 - 4,5 Juta",
    },
    {
      id: 2,
      perusahaan: "PT Maju Cipta Mas",
      posisi: "Service Advisor",
      lokasi: "Bekasi",
      tipe: "Full Time",
      gaji: "Rp 4 - 5 Juta",
    },
    {
      id: 3,
      perusahaan: "PT Hanwa Steel Service",
      posisi: "Operator Produksi",
      lokasi: "Bekasi",
      tipe: "Kontrak",
      gaji: "Rp 5,6 Juta",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-red-700 text-white py-12 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Cari Kerja <span className="text-yellow-400">PALING MUDAH</span> <br />
          Menggunakan GET JOB
        </h1>

        {/* Search Box */}
        <div className="bg-white flex items-center justify-between rounded-xl shadow-md max-w-3xl mx-auto p-4">
          <input
            type="text"
            placeholder="Masukkan nama pekerjaan"
            className="flex-1 px-3 py-2 outline-none text-black"
          />
          <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold">
            Cari
          </button>
        </div>

        {/* Categories */}
        <div className="mt-4 text-sm">
          <span className="mr-2">Paling sering dicari:</span>
          <span className="bg-yellow-400 text-black px-2 py-1 rounded-md mr-2">
            Web Developer
          </span>
          <span className="bg-yellow-400 text-black px-2 py-1 rounded-md mr-2">
            Data Analyst
          </span>
          <span className="bg-yellow-400 text-black px-2 py-1 rounded-md">
            Content Creator
          </span>
        </div>
      </div>

      {/* Job List */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Lowongan Pekerjaan Terpopuler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-md p-5">
              <h3 className="text-lg font-semibold">{job.posisi}</h3>
              <p className="text-gray-600">{job.perusahaan}</p>
              <p className="text-sm text-gray-500">{job.lokasi} • {job.tipe}</p>
              <p className="mt-2 font-bold text-green-600">{job.gaji}</p>
              <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                Lihat Detail
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
