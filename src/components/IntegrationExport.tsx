import { DownloadCloud, Smartphone, Mail, FileSpreadsheet, FileIcon } from "lucide-react";

export default function IntegrationExport() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dışa Aktarım ve Dağıtım Merkezi</h2>
        <p className="text-slate-500 mt-1">Hazırlanan programı resmi kurumlara gönderin veya öğretmenlerle anında paylaşın.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Resmi Evraklar */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">MEB ve İdari Çıktılar</h3>
            
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-xl transition-colors group">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><DownloadCloud className="w-5 h-5" /></div>
                  <div className="text-left">
                     <div className="font-bold text-slate-700">MEB e-Okul Formatı (.xml)</div>
                     <div className="text-xs text-slate-500">e-Okul sistemine direkt yüklenebilir format.</div>
                  </div>
               </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 rounded-xl transition-colors group">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors"><FileSpreadsheet className="w-5 h-5" /></div>
                  <div className="text-left">
                     <div className="font-bold text-slate-700">Ek Ders ve Maaş Çizelgesi (.xlsx)</div>
                     <div className="text-xs text-slate-500">Maliye/Muhasebe için hesaplanmış puantaj tablosu.</div>
                  </div>
               </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-rose-50 border border-slate-100 rounded-xl transition-colors group">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 text-rose-600 rounded-lg group-hover:bg-rose-600 group-hover:text-white transition-colors"><FileIcon className="w-5 h-5" /></div>
                  <div className="text-left">
                     <div className="font-bold text-slate-700">Bilsa TXT Export</div>
                     <div className="text-xs text-slate-500">Bilsa programlarına uyumlu geriye dönük aktarım.</div>
                  </div>
               </div>
            </button>
         </div>

         {/* İletişim ve Dağıtım */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Öğretmenlere Dağıtım (El Programı)</h3>
            
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-green-50 border border-slate-100 rounded-xl transition-colors group">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors"><Smartphone className="w-5 h-5" /></div>
                  <div className="text-left">
                     <div className="font-bold text-slate-700">WhatsApp ile Dağıt</div>
                     <div className="text-xs text-slate-500">Kayıtlı telefon numaralarına kişisel PDF'leri gönder.</div>
                  </div>
               </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-sky-50 border border-slate-100 rounded-xl transition-colors group">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 text-sky-600 rounded-lg group-hover:bg-sky-600 group-hover:text-white transition-colors"><Mail className="w-5 h-5" /></div>
                  <div className="text-left">
                     <div className="font-bold text-slate-700">E-Posta ile Gönder</div>
                     <div className="text-xs text-slate-500">Resmi okul mailinden öğretmenlere toplu gönderim.</div>
                  </div>
               </div>
            </button>

         </div>
      </div>
    </div>
  );
}
