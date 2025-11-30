import { useState } from "react";
import { Search, MapPin, Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const handleSearch = () => {
    const params = new URLSearchParams({
      keyword: keyword || "",
      lokasi: location || "",
      kategori: category || "",
    });

    router.push(`/cari-loker?${params.toString()}`);
  };


  const locations = [
    "Jakarta", "Bandung", "Surabaya", "Semarang", "Yogyakarta",
    "Bali", "Medan", "Makassar", "Palembang", "Malang"
  ];

  const categories = [
    "IT & Software", "Marketing", "Design", "Finance",
    "Sales", "Human Resources", "Customer Service",
    "Engineering", "Healthcare", "Education"
  ];

  const filteredLocations = locations.filter((loc) =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(category.toLowerCase())
  );

  return (
    <section className="relative bg-gradient-to-br from-[#0f5132] via-[#146c43] to-[#0d4a2e] text-white py-16 overflow-visible">
      {/* Background Pattern - Christmas Theme */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Decorative Christmas Elements */}
      <div className="absolute top-20 left-10 text-2xl opacity-80 animate-pulse">❄️</div>
      <div className="absolute top-32 left-20 text-xl opacity-60 animate-bounce">⭐</div>
      <div className="absolute bottom-40 right-32 text-2xl opacity-80 animate-pulse">🎄</div>

      <div className="relative max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-12">

        {/* Bagian Kiri */}
        <div className="md:w-1/2 space-y-8 z-10">
          <div className="space-y-4">
            <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce mt-4 shadow-lg border-2 border-white">
              🎅 Pencarian Loker Spesial Natal - Sanata Dharma
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Cari Kerja <span className="text-red-400 drop-shadow-lg">PALING MUDAH</span><br />
              Menggunakan <span className="bg-white text-[#0f5132] px-3 py-1 rounded-lg">GETJOB</span>
            </h1>
            <p className="text-xl text-green-100">
              🎄 Temukan pekerjaan impianmu di musim Natal ini! 🎁
            </p>
          </div>

          {/* Form Pencarian */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-800 space-y-4 transform hover:scale-[1.02] transition-transform border-4 border-red-500">
            {/* Search Keyword */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="🎄 Masukkan kata kunci, posisi, atau perusahaan"
                className="w-full pl-12 pr-4 py-4 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Dropdowns */}
            <div className="grid md:grid-cols-2 gap-4">

              {/* === Dropdown Lokasi === */}
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-green-600 z-10" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder=" Cari lokasi"
                  className="w-full pl-12 pr-10 py-4 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all cursor-text"
                />
                <div
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="absolute right-4 top-4 cursor-pointer"
                >
                  {showLocationDropdown ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                {showLocationDropdown && filteredLocations.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white border-2 border-green-300 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {filteredLocations.map((loc, index) => (
                      <div
                        key={index}
                        onMouseDown={() => {
                          setLocation(loc);
                          setShowLocationDropdown(false);
                        }}
                        className={`px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${location === loc ? "bg-red-50 text-[#0f5132] font-semibold" : ""
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-600" />
                          {loc}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* === Dropdown Kategori === */}
              <div className="relative">
                <Briefcase className="absolute left-4 top-4 w-5 h-5 text-green-600 z-10" />
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onFocus={() => setShowCategoryDropdown(true)}
                  placeholder=" Cari kategori"
                  className="w-full pl-12 pr-10 py-4 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all cursor-text"
                />
                <div
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="absolute right-4 top-4 cursor-pointer"
                >
                  {showCategoryDropdown ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                {showCategoryDropdown && filteredCategories.length > 0 && (
                  <div className="absolute z-20 w-full mt-2 bg-white border-2 border-green-300 rounded-xl shadow-lg max-h-56 overflow-y-auto">
                    {filteredCategories.map((cat, index) => (
                      <div
                        key={index}
                        onMouseDown={() => {
                          setCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className={`px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${category === cat ? "bg-red-50 text-[#0f5132] font-semibold" : ""
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-red-600" />
                          {cat}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 border-2 border-white"
            >
              <Search className="w-5 h-5" />
              Cari Pekerjaan Sekarang
            </button>

          </div>
        </div>

        {/* Bagian Kanan: Ilustrasi */}
        <div className="md:w-1/2 flex justify-end items-end mt-8 md:mt-0 relative">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-red-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div
            className="absolute top-20 right-20 w-20 h-20 border-4 border-red-500 rounded-full opacity-30 animate-spin"
            style={{ animationDuration: "10s" }}
          ></div>

          <img
            src="/1764304039075.png"
            alt="Ilustrasi Orang Cari Kerja"
            className="
                max-w-[700px] w-full relative 
                bottom-0 drop-shadow-2xl z-10 
                transform transition-transform duration-500 
                hover:scale-105

                translate-x-30   /* → geser ke kanan */
                translate-y-30   /* → geser ke bawah */"/>
        </div>
      </div>
    </section>
  );
}