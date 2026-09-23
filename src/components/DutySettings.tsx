import { ShieldAlert, MapPin, UserX } from "lucide-react";

export default function DutySettings() {
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  const zones = ["Bahçe", "Zemin Kat", "1. Kat", "2. Kat"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Nöbet Dağıtım Sistemi</h2>
          <p className="text-slate-500 mt-1">Kat planlarını belirleyin, muafiyetleri ayarlayın ve yapay zekanın nöbet çizelgesini inceleyin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bölgeler ve Kurallar Paneli (Sol) */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 mb-4 text-emerald-600">
               <MapPin className="w-5 h-5" />
               <h3 className="font-bold text-slate-800">Nöbet Yerleri</h3>
             </div>
             <div className="space-y-3">
               {zones.map((zone, i) => (
                 <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                   <span className="font-medium text-slate-700">{zone}</span>
                   <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Maks {i === 0 ? 3 : 2} Kişi</span>
                 </div>
               ))}
               <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                 + Yeni Bölge Ekle
               </button>
             </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 mb-4 text-rose-500">
               <UserX className="w-5 h-5" />
               <h3 className="font-bold text-slate-800">Muafiyet & Sabitleme</h3>
             </div>
             <div className="space-y-3">
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                   <span className="block text-sm font-bold text-rose-800">Ali Yılmaz (Müdür Yrd.)</span>
                   <span className="text-xs text-rose-600">Tamamen Muaf</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                   <span className="block text-sm font-bold text-indigo-800">Hasan Turhan</span>
                   <span className="text-xs text-indigo-600">Sadece Bahçe'ye Sabitli</span>
                </div>
             </div>
           </div>

           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 mb-4 text-amber-500">
               <ShieldAlert className="w-5 h-5" />
               <h3 className="font-bold text-slate-800">Dağıtım Kuralları</h3>
             </div>
             <div className="space-y-3 mt-4">
                <label className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-indigo-600 rounded" />
                  <span className="text-sm font-bold text-slate-700">En Az Ders Kuralı</span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 text-indigo-600 rounded" />
                  <span className="text-sm font-bold text-slate-700">Haftalık Rotasyon</span>
                </label>
             </div>
           </div>
        </div>

        {/* Nöbet Çizelgesi Tablosu (Sağ) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
           <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Örnek Nöbet Çizelgesi (Önizleme)</h3>
                <p className="text-xs text-slate-500">Bu tablo optimizasyon sonrası yapay zeka tarafından otomatik doldurulacaktır.</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                Nöbetleri Otomatik Dağıt
              </button>
           </div>
           
           <div className="flex-1 p-6 overflow-auto bg-slate-50/30">
              <table className="w-full border-collapse bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <thead>
                  <tr>
                    <th className="border-b border-r border-slate-200 bg-slate-50 p-3 text-slate-500 font-bold text-sm text-left">Bölge \ Gün</th>
                    {days.map(d => <th key={d} className="border-b border-slate-200 bg-slate-50 p-3 text-slate-700 font-bold text-sm w-[16%]">{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {zones.map(zone => (
                    <tr key={zone}>
                       <td className="border-b border-r border-slate-200 p-3 font-bold text-slate-700 bg-slate-50/50">
                          {zone}
                       </td>
                       {days.map(day => (
                          <td key={day} className="border-b border-slate-200 p-2 align-top h-24">
                             {/* Mock assigned teachers */}
                             {Math.random() > 0.3 && (
                                <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-lg mb-2 shadow-sm cursor-pointer hover:bg-indigo-100 transition-colors">
                                  <span className="block text-xs font-bold text-indigo-800">Ahmet B.</span>
                                </div>
                             )}
                             {Math.random() > 0.5 && (
                                <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg shadow-sm cursor-pointer hover:bg-emerald-100 transition-colors">
                                  <span className="block text-xs font-bold text-emerald-800">Ayşe K.</span>
                                </div>
                             )}
                          </td>
                       ))}
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}
