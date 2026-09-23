import { Hand, Save, AlertTriangle, RefreshCcw } from "lucide-react";

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
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">İnteraktif Sürükle & Bırak Düzenleyici</h2>
          <p className="text-slate-500 mt-1">Yapay zekanın hazırladığı program üzerinde manuel rötuşlar yapın.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 shadow-sm">
             <AlertTriangle className="w-5 h-5" />
             <span className="text-sm font-bold">Çakışma: 0</span>
           </div>
           <button className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 shadow-sm">
             <Save className="w-4 h-4" /> Değişiklikleri Kaydet
           </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4 shrink-0">
         <select className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 shadow-sm outline-none">
            <option>Hasan Turhan (Öğretmen)</option>
            <option>9/A (Sınıf)</option>
            <option>Bilgisayar Lab-1 (Derslik)</option>
         </select>
         <button className="p-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 shadow-sm">
            <RefreshCcw className="w-5 h-5" />
         </button>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col relative">
         <div className="absolute inset-0 pointer-events-none border-[3px] border-indigo-500/0 transition-colors z-10" id="drag-overlay"></div>
         <table className="w-full h-full border-collapse">
            <thead>
               <tr>
                  <th className="border-b border-r border-slate-200 bg-slate-50 p-2 w-24"></th>
                  {Array(8).fill(0).map((_, i) => (
                     <th key={i} className="border-b border-slate-200 bg-slate-50 p-2 text-xs font-bold text-slate-500 w-[11%]">
                        {i + 1}. Ders
                     </th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {days.map((day, dIdx) => (
                  <tr key={day}>
                     <td className="border-b border-r border-slate-200 bg-slate-50 p-2 text-center text-sm font-bold text-slate-700">
                        {day}
                     </td>
                     {schedule[dIdx].map((lesson, hIdx) => (
                        <td key={hIdx} className="border-b border-r last:border-r-0 border-slate-200 p-1 relative group cursor-grab active:cursor-grabbing">
                           {lesson ? (
                              <div className="w-full h-full min-h-[60px] bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 rounded-lg flex flex-col items-center justify-center shadow-sm transition-colors">
                                 <span className="text-sm font-bold text-indigo-800">{lesson.split(" ")[0]}</span>
                                 <span className="text-xs font-medium text-indigo-600">{lesson.split(" ")[1]}</span>
                                 <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                                    <Hand className="w-4 h-4 text-indigo-500" />
                                 </div>
                              </div>
                           ) : (
                              <div className="w-full h-full min-h-[60px] bg-slate-50/50 hover:bg-slate-100 rounded-lg border border-dashed border-transparent hover:border-slate-300 transition-colors">
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
