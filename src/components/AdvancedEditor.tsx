import { Hand, Save, AlertTriangle, RefreshCcw, Printer, FileText, Download } from "lucide-react";

export default function AdvancedEditor() {
  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  
  // Sample schedule blocks for visual
  const schedule = [
    ["9/A MAT", "9/A MAT", "", "11/C FİZ", "11/C FİZ", "", "10/B KİM", "10/B KİM"],
    ["", "", "12/A GEO", "12/A GEO", "9/B MAT", "9/B MAT", "", ""],
    ["11/D FİZ", "11/D FİZ", "10/A MAT", "10/A MAT", "", "", "9/C MAT", "9/C MAT"],
    ["", "", "", "", "12/B FİZ", "12/B FİZ", "11/A KİM", "11/A KİM"],
    ["9/D MAT", "9/D MAT", "10/C MAT", "10/C MAT", "", "", "", ""]
  ];

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">İnteraktif Sürükle & Bırak Düzenleyici</h2>
          <p className="text-sm text-zinc-500 mt-1">Yapay zekanın hazırladığı program üzerinde manuel rötuşlar yapın.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md border border-amber-200 shadow-sm">
             <AlertTriangle className="w-4 h-4" />
             <span className="text-xs font-bold">Çakışma: 0</span>
           </div>
           
           <div className="flex items-center gap-1 border-l border-zinc-200 pl-3">
             <button className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm" title="Programı Yazdır">
               <Printer size={16} />
             </button>
             <button className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm" title="PDF İndir">
               <FileText size={16} />
             </button>
             <button className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm" title="Excel'e Aktar">
               <Download size={16} />
             </button>
           </div>

           <button className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-md text-xs font-semibold text-white hover:bg-zinc-800 shadow-sm ml-2">
             <Save className="w-3.5 h-3.5" /> Değişiklikleri Kaydet
           </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4 shrink-0">
         <select className="px-3 py-1.5 bg-white border border-zinc-200 rounded-md text-sm font-semibold text-zinc-700 shadow-sm outline-none hover:border-zinc-300">
            <option>Hasan Turhan (Öğretmen)</option>
            <option>9/A (Sınıf)</option>
            <option>Bilgisayar Lab-1 (Derslik)</option>
         </select>
         <button className="p-1.5 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 shadow-sm">
            <RefreshCcw className="w-4 h-4" />
         </button>
      </div>

      <div className="flex-1 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative">
         <table className="w-full h-full border-collapse">
            <thead>
               <tr>
                  <th className="border-b border-r border-zinc-200 bg-zinc-50 p-2 w-24"></th>
                  {Array(8).fill(0).map((_, i) => (
                     <th key={i} className="border-b border-zinc-200 bg-zinc-50 p-2 text-[11px] font-bold text-zinc-500 w-[11%]">
                        {i + 1}. Ders
                     </th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {days.map((day, dIdx) => (
                  <tr key={day}>
                     <td className="border-b border-r border-zinc-200 bg-zinc-50 p-2 text-center text-xs font-semibold text-zinc-700">
                        {day}
                     </td>
                     {schedule[dIdx].map((lesson, hIdx) => (
                        <td key={hIdx} className="border-b border-r last:border-r-0 border-zinc-200 p-1.5 relative group cursor-grab active:cursor-grabbing">
                           {lesson ? (
                              <div className="w-full h-full min-h-[50px] bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md flex flex-col items-center justify-center shadow-sm transition-colors">
                                 <span className="text-xs font-bold text-zinc-900">{lesson.split(" ")[0]}</span>
                                 <span className="text-[10px] font-medium text-zinc-500">{lesson.split(" ")[1]}</span>
                                 <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100">
                                    <Hand className="w-3.5 h-3.5 text-zinc-400" />
                                 </div>
                              </div>
                           ) : (
                              <div className="w-full h-full min-h-[50px] bg-zinc-50/50 hover:bg-zinc-100 rounded-md border border-dashed border-transparent hover:border-zinc-300 transition-colors">
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
  );
}
