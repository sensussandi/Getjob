"use client";
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Award, Calendar, Linkedin, Instagram, FileText, Edit, Loader2, ExternalLink, Download } from 'lucide-react';

export default function DashboardMHS() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem('userEmail') || "Samuel0899@gmail.com";
      
      const response = await fetch(`http://localhost:5000/api/users/email/${userEmail}`);
      
      if (!response.ok) {
        throw new Error('Data tidak ditemukan');
      }
      
      const result = await response.json();
      setUserData(result.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-100">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-400 rounded-full opacity-20 animate-pulse"></div>
            <Loader2 className="w-24 h-24 text-red-900 animate-spin relative z-10" />
          </div>
          <p className="text-gray-600 text-lg font-medium">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-red-50 to-slate-100">
        <div className="bg-white border-l-4 border-red-500 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <p className="text-red-900 font-bold text-lg">Terjadi Kesalahan</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
          <button 
            onClick={fetchUserData}
            className="w-full bg-gradient-to-r from-red-900 to-red-700 text-white px-4 py-3 rounded-xl hover:from-red-800 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-red-50 to-slate-100">
        <div className="text-center max-w-md">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-red-200 to-red-100 rounded-3xl rotate-6"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-red-200 rounded-3xl -rotate-6"></div>
            <div className="relative bg-white rounded-3xl w-full h-full flex items-center justify-center shadow-lg">
              <User className="w-16 h-16 text-red-900" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Profil Belum Lengkap</h2>
          <p className="text-gray-600 mb-8">Silakan lengkapi data profil untuk melanjutkan</p>
          <button 
            onClick={() => window.location.href = '/lengkapiDataMHS'}
            className="bg-gradient-to-r from-red-900 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-800 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold"
          >
            Lengkapi Data Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Hero Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-950 via-red-900 to-red-950 rounded-3xl shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-800 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-700 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10 p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-red-100 text-sm font-medium mb-4">
                  Dashboard Mahasiswa
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">
                  Selamat datang, {userData.nama_lengkap.split(' ')[0]}!
                </h1>
                <p className="text-red-100 text-lg md:text-xl">
                  Kelola profil dan eksplorasi peluang karir Anda
                </p>
              </div>
              <button 
                onClick={() => window.location.href = '/lengkapiDataMHS'}
                className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-3 border border-white/20 hover:border-white/40 shadow-lg"
              >
                <Edit className="w-5 h-5" />
                <span className="font-medium">Edit Profil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Showcase Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative h-40 md:h-48 bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
          </div>
          
          <div className="px-6 md:px-10 pb-8">
            <div className="flex flex-col md:flex-row items-start gap-6 -mt-20 md:-mt-24">
              
              {/* Profile Photo */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition"></div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white p-2 shadow-2xl">
                  {userData.photo_file ? (
                    <img 
                      src={`http://localhost:5000/${userData.photo_file}`}
                      alt={userData.nama_lengkap}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center">
                      <User className="w-16 h-16 md:w-20 md:h-20 text-red-900" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 md:mt-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {userData.nama_lengkap}
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-red-600" />
                  <p className="text-red-900 font-semibold text-lg">
                    {userData.kategori_pekerjaan}
                  </p>
                </div>
                
                {/* Contact Badges */}
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={`mailto:${userData.email}`}
                    className="group bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border border-slate-200 hover:border-slate-300 shadow-sm"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{userData.email}</span>
                  </a>
                  
                  <a 
                    href={`https://wa.me/${userData.no_telepon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-green-50 hover:bg-green-100 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border border-green-200 hover:border-green-300 shadow-sm"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{userData.no_telepon}</span>
                  </a>

                  {userData.cv_file && (
                    <a 
                      href={`http://localhost:5000/${userData.cv_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-purple-50 hover:bg-purple-100 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all border border-purple-200 hover:border-purple-300 shadow-sm"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                        <Download className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Download CV</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Personal Information */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <User className="w-6 h-6 text-red-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Informasi Pribadi</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Tanggal Lahir</p>
                  <p className="text-gray-900 font-semibold">
                    {new Date(userData.tanggal_lahir).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Jenis Kelamin</p>
                  <p className="text-gray-900 font-semibold">{userData.jenis_kelamin}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Alamat</p>
                  <p className="text-gray-900 font-semibold">{userData.alamat}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Education & Skills */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <GraduationCap className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pendidikan & Keahlian</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Pendidikan Terakhir</p>
                  <p className="text-gray-900 font-semibold">{userData.pendidikan_terakhir}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Keahlian</p>
                  <p className="text-gray-900 font-semibold">{userData.keahlian}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-slate-50 to-transparent rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Kategori Pekerjaan</p>
                  <p className="text-gray-900 font-semibold">{userData.kategori_pekerjaan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 md:col-span-2 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                <Briefcase className="w-6 h-6 text-purple-900" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pengalaman Kerja</h3>
            </div>
            
            <div className="bg-gradient-to-br from-slate-50 to-transparent rounded-xl p-6 border border-slate-100">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                {userData.pengalaman_kerja}
              </p>
            </div>
          </div>

          {/* Social Media */}
          {(userData.linkedin_url || userData.instagram_url) && (
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 md:col-span-2 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition">
                  <Linkedin className="w-6 h-6 text-green-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Media Sosial</h3>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {userData.linkedin_url && (
                  <a 
                    href={userData.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex-1 min-w-[200px] bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 px-6 py-4 rounded-xl transition-all border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover/link:scale-110 transition">
                        <Linkedin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 font-bold">LinkedIn</p>
                        <p className="text-sm text-gray-500">Lihat profil profesional</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-blue-600 group-hover/link:translate-x-1 transition" />
                    </div>
                  </a>
                )}
                
                {userData.instagram_url && (
                  <a 
                    href={userData.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link flex-1 min-w-[200px] bg-gradient-to-r from-pink-50 to-pink-100/50 hover:from-pink-100 hover:to-pink-200/50 px-6 py-4 rounded-xl transition-all border border-pink-200 hover:border-pink-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center group-hover/link:scale-110 transition">
                        <Instagram className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 font-bold">Instagram</p>
                        <p className="text-sm text-gray-500">Lihat aktivitas sosial</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-pink-600 group-hover/link:translate-x-1 transition" />
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}