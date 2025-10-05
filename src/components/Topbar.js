"use client";
import { useState } from 'react';
import { Search, MapPin, Briefcase, Bell, HelpCircle, Menu } from 'lucide-react';

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "Profil Anda telah dilihat 5 perusahaan", time: "2 jam lalu", unread: true },
    { id: 2, text: "Ada 3 lowongan baru sesuai keahlian Anda", time: "5 jam lalu", unread: true },
    { id: 3, text: "Selamat! Lamaran Anda di PT Maju telah diterima", time: "1 hari lalu", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Search Section */}
          <div className="flex-1 flex items-center gap-3 max-w-4xl">
            
            {/* Keyword Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pekerjaan atau perusahaan"
                className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white hover:border-slate-400 text-sm"
              />
            </div>

            {/* Location Filter */}
            <div className="relative hidden md:block min-w-[180px]">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white hover:border-slate-400 appearance-none text-sm cursor-pointer">
                <option>Semua Lokasi</option>
                <option>Jakarta</option>
                <option>Bandung</option>
                <option>Surabaya</option>
                <option>Semarang</option>
                <option>Yogyakarta</option>
              </select>
            </div>

            {/* Job Category Filter */}
            <div className="relative hidden lg:block min-w-[180px]">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition bg-white hover:border-slate-400 appearance-none text-sm cursor-pointer">
                <option>Semua Pekerjaan</option>
                <option>IT/Software Development</option>
                <option>Marketing</option>
                <option>Design</option>
                <option>Finance</option>
                <option>Human Resources</option>
                <option>Sales</option>
              </select>
            </div>

            {/* Search Button */}
            <button className="hidden md:flex items-center justify-center bg-gradient-to-r from-red-900 to-red-700 text-white px-6 py-2.5 rounded-xl hover:from-red-800 hover:to-red-600 transition-all shadow-md hover:shadow-lg font-medium">
              Cari
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-red-900 transition" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-4 bg-gradient-to-r from-red-900 to-red-700 text-white">
                    <h3 className="font-bold text-lg">Notifikasi</h3>
                    <p className="text-sm text-red-100">{unreadCount} notifikasi belum dibaca</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id}
                        className={`p-4 border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer ${
                          notif.unread ? 'bg-red-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notif.unread && (
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          )}
                          <div className="flex-1">
                            <p className={`text-sm ${notif.unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                              {notif.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-slate-50 text-center">
                    <button className="text-sm text-red-900 font-medium hover:underline">
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help Button */}
            <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors group">
              <HelpCircle className="w-5 h-5 text-gray-600 group-hover:text-red-900 transition" />
            </button>

            {/* Mobile Menu */}
            <button className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors group">
              <Menu className="w-5 h-5 text-gray-600 group-hover:text-red-900 transition" />
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden mt-3 flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm">
              <option>Lokasi</option>
              <option>Jakarta</option>
              <option>Bandung</option>
              <option>Surabaya</option>
            </select>
          </div>
          <div className="relative flex-1">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-sm">
              <option>Kategori</option>
              <option>IT</option>
              <option>Marketing</option>
              <option>Design</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}