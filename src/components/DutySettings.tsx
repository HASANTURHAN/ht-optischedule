import { ShieldAlert, MapPin, UserX, Printer, FileText, Download } from "lucide-react";

export default function DutySettings() {
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  const zones = ["Bahçe", "Zemin Kat", "1. Kat", "2. Kat"];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Nöbet Dağıtım Sistemi</h2>
          <p className="text-sm text-zinc-500 mt-1">Kat planlarını belirleyin, muafiyetleri ayarlayın ve yapay zekanın nöbet çizelgesini inceleyin.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white border border-zinc-200 rounded-md text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm" title="Çizelgeyi Yazdır">
            <Printer size={16} />
          </button>
          <button className="p-2 bg-white border border-zinc-200 rounded-md text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm" title="PDF Olarak Kaydet">
            <FileText size={16} />
          </button>
          <button className="p-2 bg-white border border-zinc-200 rounded-md text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm" title="Excel'e Aktar">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bölgeler ve Kurallar Paneli (Sol) */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-5 rounded-xl shadow-sm border border-zinc-200">
             <div className="flex items-center gap-2 mb-4 text-zinc-900">
               <MapPin className="w-4 h-4" />
               <h3 className="font-semibold text-sm">Nöbet Yerleri</h3>
             </div>
             <div className="space-y-2">
               {zones.map((zone, i) => (
                 <div key={i} className="flex justify-between items-center p-2.5 bg-zinc-50 rounded-md border border-zinc-100">
                   <span className="font-medium text-xs text-zinc-700">{zone}</span>
                   <span className="text-[10px] bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded font-semibold">Maks {i === 0 ? 3 : 2} Kişi</span>
                 </div>
               ))}
               <button className="w-full py-2 mt-2 border border-dashed border-zinc-300 rounded-md text-xs text-zinc-500 font-medium hover:border-zinc-400 hover:text-zinc-700 transition-colors">
                 + Yeni Bölge Ekle
               </button>
             </div>
           </div>

           <div className="bg-white p-5 rounded-xl shadow-sm border border-zinc-200">
             <div className="flex items-center gap-2 mb-4 text-zinc-900">
               <UserX className="w-4 h-4" />
               <h3 className="font-semibold text-sm">Muafiyet & Sabitleme</h3>
             </div>
             <div className="space-y-2">
                <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-md">
                   <span className="block text-xs font-semibold text-zinc-800">Ali Yılmaz (Müdür Yrd.)</span>
                   <span className="text-[10px] text-zinc-500">Tamamen Muaf</span>
                </div>
                <div className="p-2.5 bg-zinc-50 border border-zinc-100 rounded-md">
                   <span className="block text-xs font-semibold text-zinc-800">Hasan Turhan</span>
                   <span className="text-[10px] text-zinc-500">Sadece Bahçe'ye Sabitli</span>
                </div>
             </div>
           </div>

           <div className="bg-white p-5 rounded-xl shadow-sm border border-zinc-200">
             <div className="flex items-center gap-2 mb-4 text-zinc-900">
               <ShieldAlert className="w-4 h-4" />
               <h3 className="font-semibold text-sm">Dağıtım Kuralları</h3>
             </div>
             <div className="space-y-3 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900" />
                  <span className="text-xs font-medium text-zinc-700">En Az Ders Kuralı</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900" />
                  <span className="text-xs font-medium text-zinc-700">Haftalık Rotasyon</span>
                </label>
             </div>
           </div>
        </div>

        {/* Nöbet Çizelgesi Tablosu (Sağ) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
           <div className="p-5 border-b border-zinc-100 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm">Örnek Nöbet Çizelgesi (Önizleme)</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Bu tablo optimizasyon sonrası yapay zeka tarafından otomatik doldurulacaktır.</p>
              </div>
              <button className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-semibold rounded-md hover:bg-zinc-800 transition-colors shadow-sm">
                Otomatik Dağıt
              </button>
           </div>
           
           <div className="flex-1 p-5 overflow-auto bg-zinc-50/50">
              <table className="w-full border-collapse bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
                <thead>
                  <tr>
                    <th className="border-b border-r border-zinc-200 bg-zinc-50 p-3 text-zinc-500 font-semibold text-xs text-left">Bölge \ Gün</th>
                    {days.map(d => <th key={d} className="border-b border-zinc-200 bg-zinc-50 p-3 text-zinc-700 font-semibold text-xs w-[16%]">{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {zones.map(zone => (
                    <tr key={zone}>
                       <td className="border-b border-r border-zinc-200 p-3 font-semibold text-xs text-zinc-700 bg-zinc-50">
                          {zone}
                       </td>
                       {days.map(day => (
                          <td key={day} className="border-b border-zinc-200 p-2 align-top h-20">
                             {/* Mock assigned teachers */}
                             {Math.random() > 0.3 && (
                                <div className="bg-white border border-zinc-200 p-1.5 rounded flex items-center justify-between mb-1.5 shadow-sm">
                                  <span className="text-[10px] font-bold text-zinc-800">Ahmet B.</span>
                                </div>
                             )}
                             {Math.random() > 0.5 && (
                                <div className="bg-white border border-zinc-200 p-1.5 rounded flex items-center justify-between shadow-sm">
                                  <span className="text-[10px] font-bold text-zinc-800">Ayşe K.</span>
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
