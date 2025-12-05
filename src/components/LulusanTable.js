"use client";

import { Users } from 'lucide-react';

export default function LulusanTable({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#800000]/10 overflow-hidden">
      <div className="bg-gradient-to-r from-[#800000] to-[#a00000] px-6 py-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Users className="w-6 h-6" />
          Daftar Lulusan Terbaru
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-amber-100 to-rose-100 border-b-2 border-[#800000]/20">
              <th className="px-6 py-4 text-left text-sm font-bold text-[#800000] uppercase tracking-wider">
                Nama Mahasiswa
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-[#800000] uppercase tracking-wider">
                Program Studi
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-[#800000] uppercase tracking-wider">
                Tahun
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-[#800000] uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold text-[#800000] uppercase tracking-wider">
                IPK
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#800000]/10">
            {data.length > 0 ? (
              data.map((item, i) => (
                <tr key={i} className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 transition-all">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#800000]">{item.nama}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-[#800000]/10 text-[#800000] rounded-full text-sm font-medium">
                      {item.prodi}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-[#800000]">{item.tahun}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[#800000] font-medium">{item.gender}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg font-bold">
                      {item.ipk}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="text-[#800000]/50 font-medium">
                    Tidak ada data yang sesuai dengan filter
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}