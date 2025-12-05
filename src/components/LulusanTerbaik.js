"use client";

import { Award, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function LulusanTerbaik({ data }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#800000]/10 overflow-hidden sticky top-4">
      <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Award className="w-6 h-6" />
              Lulusan Terbaik
            </h2>
            <p className="text-amber-100 text-sm mt-1">Per Program Studi ({data.length} Prodi)</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 max-h-[600px] overflow-y-auto space-y-3 bg-gradient-to-br from-amber-50 via-white to-rose-50">
        {data.slice(0, 5).map((item, i) => (
          <div
            key={i}
            className="group relative bg-white rounded-xl p-4 border-l-4 border-[#800000] shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              #{i + 1}
            </div>
            
            <div className="pr-8">
              <h3 className="font-bold text-[#800000] text-lg mb-1">{item.nama}</h3>
              <p className="text-sm text-[#800000]/70 font-medium mb-2">{item.prodi}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-lg font-bold text-sm">
                    IPK {item.ipk}
                  </span>
                </div>
                <span className="text-[#800000] font-semibold text-sm">
                  {item.tahun}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {data.length > 5 && (
          <div className="text-center py-2">
            <span className="text-[#800000]/60 text-sm font-medium">
              Dan {data.length - 5} lulusan terbaik lainnya
            </span>
          </div>
        )}
      </div>
      
      {/* Button to Full Page */}
      <div className="p-6 pt-0">
        <Link href="/lihatLulusan/terbaik">
          <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#800000] to-[#a00000] text-white rounded-xl font-bold text-lg hover:from-[#900000] hover:to-[#b00000] transition-all hover:shadow-xl hover:-translate-y-1">
            <Award className="w-6 h-6" />
            Lihat Semua Lulusan Terbaik
            <ExternalLink className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}