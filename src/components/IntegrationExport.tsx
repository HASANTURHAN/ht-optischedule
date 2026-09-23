import { useState } from "react";
import { Printer, Download, FileText, Database, Share, Users, LayoutList, Calculator, Mail } from "lucide-react";

export default function IntegrationExport() {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (type: string) => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      alert(`${type} başarıyla dışa aktarıldı.`);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Dışa Aktarım Merkezi</h2>
        <p className="text-sm text-zinc-500 mt-1">Oluşturulan ders programını resmi evraklara, e-Okul sistemine ve öğretmenlere dağıtın.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PDF Çıktıları */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
           <div className="flex items-center gap-2 mb-6">
             <div className="p-2 bg-zinc-100 text-zinc-700 rounded-lg border border-zinc-200">
               <FileText className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-lg text-zinc-900">El Programları (PDF)</h3>
           </div>
           
           <div className="space-y-4">
              <ExportItem 
                 icon={<Users className="w-4 h-4" />}
                 title="Öğretmen El Programı" 
                 desc="Her öğretmenin kendi ders programını A5 boyutunda PDF olarak oluşturur."
                 btnText="PDF Üret"
                 isExporting={exporting === 'teacher_pdf'}
                 onClick={() => handleExport('teacher_pdf')}
              />
              <ExportItem 
                 icon={<LayoutList className="w-4 h-4" />}
                 title="Sınıf El Programı" 
                 desc="Sınıf panolarına asılacak toplu ders tablolarını PDF olarak oluşturur."
                 btnText="PDF Üret"
                 isExporting={exporting === 'class_pdf'}
                 onClick={() => handleExport('class_pdf')}
              />
           </div>
        </div>

        {/* Excel ve Tablolar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
           <div className="flex items-center gap-2 mb-6">
             <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
               <Download className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-lg text-zinc-900">Veri Tabloları (Excel)</h3>
           </div>
           
           <div className="space-y-4">
              <ExportItem 
                 icon={<Share className="w-4 h-4" />}
                 title="Genel Çarşaf Liste" 
                 desc="Öğretmen odasına asılan tüm okulun devasa excel tablosunu dışa aktarır."
                 btnText="Excel İndir"
                 isExporting={exporting === 'general_excel'}
                 onClick={() => handleExport('general_excel')}
              />
              <ExportItem 
                 icon={<Calculator className="w-4 h-4" />}
                 title="Ek Ders & Puantaj Tablosu" 
                 desc="İdareciler için öğretmenlerin girdiği haftalık toplam ders/maaş karşılığı tablosu."
                 btnText="Excel İndir"
                 isExporting={exporting === 'wage_excel'}
                 onClick={() => handleExport('wage_excel')}
              />
           </div>
        </div>

        {/* Kurumsal Entegrasyonlar */}
        <div className="md:col-span-2 bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800 text-white flex flex-col md:flex-row gap-8 items-center mt-4 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
           
           <div className="flex-1 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-zinc-300" />
                <h3 className="font-bold text-xl">MEB e-Okul & Bilsa Aktarımı</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-xl">
                Oluşturduğunuz programı doğrudan e-Okul'a işleyebilmeniz için resmi XML formatında veya eski sisteminiz için Bilsa formatında dışa aktarın.
              </p>
           </div>
           
           <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
              <button 
                onClick={() => handleExport('eokul_xml')}
                className="px-6 py-3 bg-white text-zinc-900 text-sm font-bold rounded-lg shadow-sm hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
              >
                <Database className="w-4 h-4" /> e-Okul XML İndir
              </button>
              <button 
                onClick={() => handleExport('bilsa_export')}
                className="px-6 py-3 bg-zinc-800 text-white text-sm font-bold rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Bilsa'ya Gönder (.txt)
              </button>
           </div>
        </div>

        {/* Dijital İletişim */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                 <Mail className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="font-bold text-zinc-900 text-sm">Dijital Dağıtım</h3>
                 <p className="text-xs text-zinc-500 mt-1">Öğretmenlere programlarını tek tıkla e-posta veya SMS ile gönderin.</p>
              </div>
           </div>
           <button 
             onClick={() => handleExport('email')}
             className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-md shadow-sm hover:bg-blue-700 transition-colors"
           >
             Tümüne Gönder
           </button>
        </div>

      </div>
    </div>
  );
}

function ExportItem({ icon, title, desc, btnText, isExporting, onClick }: { icon: React.ReactNode, title: string, desc: string, btnText: string, isExporting: boolean, onClick: () => void }) {
  return (
    <div className="p-4 rounded-lg border border-zinc-100 bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
       <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-sm text-zinc-900 flex items-center gap-2">
             {icon} {title}
          </h4>
          <button 
            onClick={onClick}
            disabled={isExporting}
            className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-[11px] font-bold rounded shadow-sm hover:bg-zinc-50 transition-colors flex items-center gap-1.5"
          >
            {isExporting ? <span className="w-3 h-3 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin"></span> : null}
            {isExporting ? 'Hazırlanıyor...' : btnText}
          </button>
       </div>
       <p className="text-[11px] text-zinc-500 pr-16">{desc}</p>
    </div>
  );
}
