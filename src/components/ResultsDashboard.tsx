import { FileText, PieChart, Download, Printer } from "lucide-react";

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

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[400px] flex items-center justify-center">
         <div className="text-center text-slate-400">
            <PieChart className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-slate-600">Program Hesaplandıktan Sonra Grafikler Burada Belirecek</h3>
            <p className="text-sm mt-2 max-w-md mx-auto">Hangi öğretmenin saat kaçta dersi var, haftalık nöbet dağılımları ve genel okul grafikleri bu panelde interaktif olarak sergilenecek.</p>
         </div>
      </div>
    </div>
  );
}
