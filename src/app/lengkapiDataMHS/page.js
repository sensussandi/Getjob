"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, Calendar, MapPin, Mail, Phone, GraduationCap, Award, Briefcase,
  Linkedin, Instagram, FileText, Upload, Camera, CheckCircle2, Loader2, ArrowRight
} from "lucide-react";

// Warna utama untuk Marun: red-900 (terlihat gelap dan kaya) atau red-800
const PRIMARY_COLOR_CLASS = 'red-900';
const PRIMARY_ACCENT_CLASS = 'red-700';

export default function LengkapiData() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaLengkap: "", tanggalLahir: "", jenisKelamin: "", alamat: "", email: "",
    noTelepon: "", pendidikanTerakhir: "", keahlian: "", kategoriPekerjaan: "",
    pengalamanKerja: "", linkedinUrl: "", instagramUrl: "", cvFile: null, photoFile: null,
  });

  const [cvFileName, setCvFileName] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
          alert("Email pengguna tidak ditemukan. Silakan login ulang.");
          router.push("/loginMhs");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/users/email/${userEmail}`);
        const result = await response.json();

        if (result.success && result.data) {
          const mhs = result.data;
          setFormData({
            namaLengkap: mhs.nama_lengkap || "",
            tanggalLahir: mhs.tanggal_lahir ? mhs.tanggal_lahir.split("T")[0] : "",
            jenisKelamin: mhs.jenis_kelamin || "",
            alamat: mhs.alamat || "",
            email: mhs.email || "",
            noTelepon: mhs.no_telepon || "",
            pendidikanTerakhir: mhs.pendidikan_terakhir || "",
            keahlian: mhs.keahlian || "",
            kategoriPekerjaan: mhs.kategori_pekerjaan || "",
            pengalamanKerja: mhs.pengalaman_kerja || "",
            linkedinUrl: mhs.linkedin_url || "",
            instagramUrl: mhs.instagram_url || "",
            cvFile: null, photoFile: null,
          });
          if (mhs.photo_file) setPhotoPreview(`http://localhost:5000/${mhs.photo_file}`);
          if (mhs.cv_file) setCvFileName(mhs.cv_file.split("/").pop());
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      if (name === "cvFile") setCvFileName(files[0].name);
      if (name === "photoFile") {
        const reader = new FileReader();
        reader.onloadend = () => setPhotoPreview(reader.result);
        reader.readAsDataURL(files[0]);
      }
    }
  };

  const handleSubmit = async () => {
    const required = {
      namaLengkap: "Nama Lengkap", tanggalLahir: "Tanggal Lahir", jenisKelamin: "Jenis Kelamin",
      alamat: "Alamat", email: "Email", noTelepon: "Nomor Telepon", pendidikanTerakhir: "Pendidikan Terakhir",
      keahlian: "Keahlian", kategoriPekerjaan: "Kategori Pekerjaan", pengalamanKerja: "Pengalaman Kerja",
    };

    for (const [key, label] of Object.entries(required)) {
      if (!formData[key] || String(formData[key]).trim() === "") {
        alert(`${label} wajib diisi!`);
        return;
      }
    }

    setIsSubmitting(true);
    const formPayload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== "") {
        formPayload.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/lengkapi-data", {
        method: "POST", body: formPayload,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gagal menyimpan data.");
      alert("Data berhasil diperbarui!");
      router.push("/dashboardMHS");
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-red-100">
        <div className="text-center">
          <Loader2 className={`w-16 h-16 text-${PRIMARY_COLOR_CLASS} animate-spin mx-auto mb-4`} />
          <p className="text-gray-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: "Informasi Dasar", icon: User },
    { number: 2, title: "Pendidikan & Keahlian", icon: GraduationCap },
    { number: 3, title: "Media & Dokumen", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-red-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full text-red-700 text-sm font-medium mb-6`}>
            <CheckCircle2 className="w-4 h-4" />
            Lengkapi Profil Anda
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-800 to-red-900 bg-clip-text text-transparent mb-4">
            Bangun Profil Profesional
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Isi informasi lengkap untuk meningkatkan peluang mendapat pekerjaan impian Anda
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' : // Tetap hijau untuk TANDA SELESAI
                      isCurrent ? `bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg scale-110` :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <p className={`text-xs font-medium mt-2 ${isCurrent ? `text-${PRIMARY_COLOR_CLASS}` : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 rounded ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          
          {/* Step 1: Info Dasar */}
          {currentStep === 1 && (
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center`}>
                  <User className={`w-6 h-6 text-${PRIMARY_COLOR_CLASS}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Informasi Dasar</h2>
                  <p className="text-gray-500 text-sm">Data pribadi dan kontak Anda</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Photo Upload - Spans 2 columns */}
                <div className="md:col-span-2 flex justify-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br from-red-100 to-red-300 flex items-center justify-center`}>
                          <Camera className={`w-12 h-12 text-${PRIMARY_COLOR_CLASS}`} />
                        </div>
                      )}
                    </div>
                    <label className={`absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-r from-${PRIMARY_ACCENT_CLASS} to-${PRIMARY_COLOR_CLASS} rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition shadow-lg`}>
                      <Upload className="w-5 h-5 text-white" />
                      <input type="file" name="photoFile" onChange={handleFileChange} accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Tanggal Lahir</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Jenis Kelamin</label>
                  <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`}>
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="email" name="email" value={formData.email} readOnly
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 bg-gray-50 rounded-xl cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">Alamat Lengkap</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="text" name="alamat" value={formData.alamat} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Nomor Telepon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="noTelepon" value={formData.noTelepon} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`}
                      placeholder="08xxxxxxxxxx" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pendidikan */}
          {currentStep === 2 && (
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center`}>
                  <GraduationCap className={`w-6 h-6 text-${PRIMARY_ACCENT_CLASS}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Pendidikan & Keahlian</h2>
                  <p className="text-gray-500 text-sm">Riwayat pendidikan dan skill Anda</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Pendidikan Terakhir</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="pendidikanTerakhir" value={formData.pendidikanTerakhir} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`}
                      placeholder="S1 Teknik Informatika" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Keahlian</label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" name="keahlian" value={formData.keahlian} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`}
                      placeholder="JavaScript, React, Node.js" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Kategori Pekerjaan</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select name="kategoriPekerjaan" value={formData.kategoriPekerjaan} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`}>
                      <option value="">Pilih Kategori</option>
                      <option value="IT/Software Development">IT/Software Development</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Design">Design</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Pengalaman Kerja</label>
                  <textarea name="pengalamanKerja" value={formData.pengalamanKerja} onChange={handleChange} rows="5"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition resize-none`}
                    placeholder="Ceritakan pengalaman kerja Anda..."></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Media & Dokumen */}
          {currentStep === 3 && (
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center`}>
                  <FileText className={`w-6 h-6 text-${PRIMARY_ACCENT_CLASS}`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Media & Dokumen</h2>
                  <p className="text-gray-500 text-sm">Upload CV dan social media</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Upload CV</label>
                  <div className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-${PRIMARY_ACCENT_CLASS} transition`}>
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <label className="cursor-pointer">
                      <span className={`text-${PRIMARY_ACCENT_CLASS} font-medium hover:underline`}>Pilih file CV</span>
                      <input type="file" name="cvFile" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="hidden" />
                    </label>
                    {cvFileName && <p className="text-sm text-green-600 mt-2 font-medium">{cvFileName}</p>}
                    <p className="text-xs text-gray-500 mt-2">PDF, DOC, atau DOCX (Max 5MB)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">LinkedIn Profile</label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`}
                      placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Instagram Profile</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-${PRIMARY_ACCENT_CLASS} focus:ring-2 focus:ring-red-200 transition`}
                      placeholder="https://instagram.com/..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="bg-slate-50 px-8 md:px-12 py-6 flex items-center justify-between">
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 text-gray-700 font-medium hover:text-red-800 transition">
                Kembali
              </button>
            )}
            
            <div className="ml-auto flex gap-3">
              {currentStep < 3 ? (
                <button onClick={() => setCurrentStep(currentStep + 1)}
                  className={`px-8 py-3 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2`}>
                  Lanjut <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting}
                  className={`px-8 py-3 rounded-xl font-semibold transition flex items-center gap-2 ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-800 to-red-900 hover:shadow-lg text-white'
                  }`}>
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}