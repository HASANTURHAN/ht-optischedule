import { FileText, Download, Printer, BarChart2 } from "lucide-react";

export default function ResultsDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sonuçlar ve Analizler</h2>
          <p className="text-slate-500 mt-1">Optimizasyon sonuçlarını inceleyin ve dışa aktarın.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm">
              <Printer className="w-4 h-4" /> Yazdır
           </button>
           <button className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 shadow-sm">
              <Download className="w-4 h-4" /> Bilsa Export (.txt)
           </button>
           <button className="flex items-center gap-2 bg-rose-600 px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-rose-700 shadow-sm">
              <FileText className="w-4 h-4" /> PDF İndir
           </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="text-slate-500 text-xs font-bold uppercase">Toplam Karnı Yarık</h4>
            <p className="text-3xl font-black text-slate-800 mt-2">16</p>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="text-slate-500 text-xs font-bold uppercase">Sıfır Boşluklu Öğretmen</h4>
            <p className="text-3xl font-black text-emerald-600 mt-2">61 <span className="text-sm font-medium text-slate-400">/ 74</span></p>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="text-slate-500 text-xs font-bold uppercase">Başarı Oranı</h4>
            <p className="text-3xl font-black text-blue-600 mt-2">%98.2</p>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h4 className="text-slate-500 text-xs font-bold uppercase">Çözüm Süresi</h4>
            <p className="text-3xl font-black text-slate-800 mt-2">5 Dk</p>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-2 mb-6">
             <BarChart2 className="text-indigo-500 w-5 h-5" />
             <h3 className="text-lg font-bold text-slate-800">Günlere Göre Ders Yoğunluğu</h3>
           </div>
           
           {/* Mock Bar Chart */}
           <div className="flex items-end gap-4 h-64 mt-8 px-4">
              {[
                { day: "Pzt", h: "70%", val: 320 },
                { day: "Sal", h: "85%", val: 400 },
                { day: "Çar", h: "90%", val: 420 },
                { day: "Per", h: "60%", val: 280 },
                { day: "Cum", h: "40%", val: 192 },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative flex items-end justify-center h-full bg-slate-50 rounded-t-lg">
                    <div 
                      className="w-3/4 bg-indigo-500 rounded-t-md group-hover:bg-indigo-600 transition-all duration-500" 
                      style={{ height: bar.h }}
                    ></div>
                    <span className="absolute -top-6 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.val} Saat
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{bar.day}</span>
                </div>
              ))}
           </div>
        </div>
        
        <div className="col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Riskli Öğretmenler</h3>
           <p className="text-sm text-slate-500 mb-4">Aşağıdaki öğretmenlerin programında mecburi boşluklar (karnı yarık) kaldı.</p>
           
           <div className="space-y-3">
             <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex justify-between items-center">
                <span className="font-bold text-rose-800 text-sm">Melek Kurt</span>
                <span className="text-xs bg-rose-200 text-rose-800 px-2 py-1 rounded font-bold">4 Boşluk</span>
             </div>
             <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex justify-between items-center">
                <span className="font-bold text-amber-800 text-sm">Elif Kayacı</span>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded font-bold">2 Boşluk</span>
             </div>
             <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex justify-between items-center">
                <span className="font-bold text-amber-800 text-sm">Fatih Kodaz</span>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded font-bold">1 Boşluk</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
