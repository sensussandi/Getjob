export default function HeroSection() {
  return (
    <section className="bg-[#800000] text-white py-12">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        
        {/* Bagian Kiri: Text + Form */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">
            Cari Kerja <span className="text-[#FFD700]">PALING MUDAH</span><br />
            Menggunakan <span className="text-white">GET JOB</span>
          </h1>

          {/* Form Pencarian */}
          <div className="bg-white rounded-lg shadow-lg p-4 text-gray-800 space-y-4">
            <div className="flex">
              <input
                type="text"
                placeholder="Masukkan nama pekerjaan"
                className="flex-1 border border-gray-300 p-2 rounded-l focus:outline-none"
              />
              <button className="bg-[#D26900] p-3 rounded hover:bg-[#b45309] flex items-center justify-center">
                <img src="/icons/search.svg" alt="Search" className="w-5 h-5" />
              </button>

            </div>

            <div className="flex space-x-4">
              <select className="w-1/2 border border-gray-300 p-2 rounded">
                <option>Cari lokasi</option>
              </select>
              <select className="w-1/2 border border-gray-300 p-2 rounded">
                <option>Cari kategori</option>
              </select>
            </div>
          </div>

          {/* Link kategori populer */}
          <div className="text-sm flex flex-wrap gap-2">
            <a href="#" className="text-blue-500 hover:underline">Content Creator</a>
            <a href="#" className="text-blue-500 hover:underline">Design Grafis</a>
            <a href="#" className="text-blue-500 hover:underline">Guru</a>
            <a href="#" className="text-blue-500 hover:underline">Dosen</a>
            <a href="#" className="text-blue-500 hover:underline">Data Analyst</a>
            {/* Tambahkan lainnya sesuai kebutuhan */}
          </div>
        </div>

        {/* Bagian Kanan: Ilustrasi */}
        {/* Bagian Kanan: Ilustrasi */}
        <div className="md:w-1/2 flex justify-end items-end mt-8 md:mt-0">
        <img
            src="/pounder.png"
            alt="Ilustrasi Orang Cari Kerja"
            className="max-[700px] relative bottom-0 mb-[-48px]"
        />
        </div>

      </div>
    </section>
  );
}
