import { useState } from "react";
import { ShieldAlert, MapPin, UserX, ArrowUpRight } from "lucide-react";

export default function DutySettings() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Nöbet Dağıtım Sistemi</h2>
          <p className="text-slate-500 mt-1">Kat planlarını belirleyin, muafiyetleri ayarlayın ve nöbet kurallarını seçin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bölgeler ve Katlar */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-emerald-600">
            <MapPin className="w-5 h-5" />
            <h3 className="font-bold text-slate-800">Nöbet Yerleri</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">Bahçe</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Maks 3 Kişi</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">Zemin Kat</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Maks 2 Kişi</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">1. Kat</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Maks 2 Kişi</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">2. Kat</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Maks 2 Kişi</span>
            </div>
            <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              + Yeni Kat/Bölge Ekle
            </button>
          </div>
        </div>

        {/* Muafiyetler ve Sabitlemeler */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-rose-500">
            <UserX className="w-5 h-5" />
            <h3 className="font-bold text-slate-800">Muafiyet & Sabitleme</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">Müdür yardımcıları, hamile veya engelli öğretmenleri nöbetten muaf tutun.</p>
          
          <div className="space-y-3">
             <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                <span className="block text-sm font-bold text-rose-800">Ali Yılmaz (Müdür Yrd.)</span>
                <span className="text-xs text-rose-600">Tamamen Muaf</span>
             </div>
             <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                <span className="block text-sm font-bold text-indigo-800">Hasan Turhan</span>
                <span className="text-xs text-indigo-600">Sadece Bahçe'ye Sabitli</span>
             </div>
             <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors">
              + Özel Durum Ekle
            </button>
          </div>
        </div>

        {/* Nöbet Kuralları */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-amber-500">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold text-slate-800">Dağıtım Kuralları</h3>
          </div>
          
          <div className="space-y-4 mt-4">
             <label className="flex items-start gap-3">
               <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-indigo-600 rounded" />
               <div className="text-sm">
                 <span className="font-bold text-slate-700 block">En Az Ders Kuralı</span>
                 <span className="text-slate-500 text-xs">Öğretmenin nöbeti, haftalık ders saatinin en az olduğu (boş olmayan) güne verilsin.</span>
               </div>
             </label>

             <label className="flex items-start gap-3">
               <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-indigo-600 rounded" />
               <div className="text-sm">
                 <span className="font-bold text-slate-700 block">Haftalık Rotasyon</span>
                 <span className="text-slate-500 text-xs">Yeni program oluşturuldukça öğretmen bir alt/üst kata kaydırılsın.</span>
               </div>
             </label>

             <label className="flex items-start gap-3">
               <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-indigo-600 rounded" />
               <div className="text-sm">
                 <span className="font-bold text-slate-700 block">Boş Güne Nöbet Yazma</span>
                 <span className="text-slate-500 text-xs">Öğretmenin hiç dersi olmadığı güne nöbet kesinlikle atama.</span>
               </div>
             </label>
          </div>
        </div>
      </div>
    </div>
  );
}
