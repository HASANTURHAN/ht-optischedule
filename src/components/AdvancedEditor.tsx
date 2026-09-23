import { useState, useEffect } from "react";
import { Hand, Save, AlertTriangle, RefreshCcw, Printer, FileText, Download, CheckCircle2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

export default function AdvancedEditor() {
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [draggedItem, setDraggedItem] = useState<{ dIdx: number, hIdx: number } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const res = await invoke("get_generated_schedule");
      const parsed = JSON.parse(res as string);
      setScheduleData(parsed);
      const tList = Object.keys(parsed).sort();
      setTeachers(tList);
      if (tList.length > 0) setSelectedEntity(tList[0]);
    } catch (e) {
      console.warn("No generated schedule found", e);
    }
  };

  const getGrid = () => {
    if (!scheduleData || !selectedEntity || !scheduleData[selectedEntity]) return null;
    
    // Create a 5x8 grid
    const grid = Array(5).fill(null).map(() => Array(8).fill(""));
    const tData = scheduleData[selectedEntity];
    
    // Python days could be "Pazartesi" or "Pazartesi" (maybe english characters)
    // We assume the keys match our DAYS array or are standard Turkish.
    // Let's do a robust match:
    DAYS.forEach((dName, dIdx) => {
       const mappedDayName = Object.keys(tData).find(k => k.toLowerCase().startsWith(dName.substring(0, 3).toLowerCase()));
       if (mappedDayName) {
          const dayData = tData[mappedDayName];
          for (let h = 1; h <= 8; h++) {
             if (dayData[h.toString()] && dayData[h.toString()] !== "BOŞ") {
                 grid[dIdx][h - 1] = dayData[h.toString()];
             }
          }
       }
    });
    return grid;
  };

  const handleDragStart = (e: React.DragEvent, dIdx: number, hIdx: number) => {
    setDraggedItem({ dIdx, hIdx });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetDIdx: number, targetHIdx: number) => {
    e.preventDefault();
    if (!draggedItem || !scheduleData || !selectedEntity) return;

    const { dIdx: srcD, hIdx: srcH } = draggedItem;
    if (srcD === targetDIdx && srcH === targetHIdx) return; // Same spot

    // Create a deep copy of the selected teacher's data to mutate
    const newData = JSON.parse(JSON.stringify(scheduleData));
    const tData = newData[selectedEntity];
    
    // Day string resolution
    const srcDayStr = Object.keys(tData).find(k => k.toLowerCase().startsWith(DAYS[srcD].substring(0, 3).toLowerCase())) || DAYS[srcD];
    const targetDayStr = Object.keys(tData).find(k => k.toLowerCase().startsWith(DAYS[targetDIdx].substring(0, 3).toLowerCase())) || DAYS[targetDIdx];

    if (!tData[srcDayStr]) tData[srcDayStr] = {};
    if (!tData[targetDayStr]) tData[targetDayStr] = {};

    const srcVal = tData[srcDayStr][(srcH + 1).toString()] || "BOŞ";
    const targetVal = tData[targetDayStr][(targetHIdx + 1).toString()] || "BOŞ";

    // Swap!
    tData[srcDayStr][(srcH + 1).toString()] = targetVal === "BOŞ" ? null : targetVal;
    tData[targetDayStr][(targetHIdx + 1).toString()] = srcVal === "BOŞ" ? null : srcVal;

    setScheduleData(newData);
    setHasChanges(true);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const grid = getGrid();

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">İnteraktif Sürükle & Bırak Düzenleyici</h2>
          <p className="text-sm text-zinc-500 mt-1">Yapay zekanın hazırladığı program üzerinde manuel rötuşlar yapın.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border shadow-sm ${hasChanges ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>
             {hasChanges ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
             <span className="text-xs font-bold">{hasChanges ? "Değişiklik Yapıldı" : "Program Güncel"}</span>
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

           <button 
             onClick={() => setHasChanges(false)}
             className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold shadow-sm ml-2 transition-all ${hasChanges ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}
             disabled={!hasChanges}
           >
             <Save className="w-3.5 h-3.5" /> Değişiklikleri Kaydet
           </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4 shrink-0 items-center">
         <select 
            value={selectedEntity} 
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="px-3 py-1.5 bg-white border border-zinc-200 rounded-md text-sm font-semibold text-zinc-700 shadow-sm outline-none hover:border-zinc-300 w-64"
         >
            {teachers.length === 0 && <option>Program Yükleniyor...</option>}
            {teachers.map(t => <option key={t} value={t}>{t}</option>)}
         </select>
         <button onClick={loadSchedule} className="p-1.5 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 shadow-sm" title="Orijinal Programa Dön">
            <RefreshCcw className="w-4 h-4" />
         </button>
      </div>

      <div className="flex-1 bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col relative min-h-0">
         {!scheduleData ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400">
               <AlertTriangle className="w-10 h-10 mb-3 opacity-20" />
               <p className="text-sm font-medium">Önce yapay zeka motorunu çalıştırıp program oluşturun.</p>
            </div>
         ) : grid ? (
           <div className="flex-1 overflow-auto custom-scrollbar">
             <table className="w-full h-full min-h-[500px] border-collapse table-fixed">
                <thead>
                   <tr>
                      <th className="border-b border-r border-zinc-200 bg-zinc-50 p-2 w-24 sticky top-0 z-10"></th>
                      {Array(8).fill(0).map((_, i) => (
                         <th key={i} className="border-b border-zinc-200 bg-zinc-50 p-2 text-[11px] font-bold text-zinc-500 w-[11%] sticky top-0 z-10">
                            {i + 1}. Ders
                         </th>
                      ))}
                   </tr>
                </thead>
                <tbody>
                   {DAYS.map((day, dIdx) => (
                      <tr key={day}>
                         <td className="border-b border-r border-zinc-200 bg-zinc-50 p-2 text-center text-xs font-semibold text-zinc-700">
                            {day}
                         </td>
                         {grid[dIdx].map((lesson, hIdx) => (
                            <td 
                              key={hIdx} 
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, dIdx, hIdx)}
                              className="border-b border-r last:border-r-0 border-zinc-200 p-1.5 relative group bg-zinc-50/20"
                            >
                               {lesson ? (
                                  <div 
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, dIdx, hIdx)}
                                    className="w-full h-full min-h-[60px] bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md flex flex-col items-center justify-center shadow-sm cursor-grab active:cursor-grabbing transition-colors"
                                  >
                                     <span className="text-[11px] font-bold text-zinc-900 text-center leading-tight">{lesson}</span>
                                     <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100">
                                        <Hand className="w-3.5 h-3.5 text-zinc-400" />
                                     </div>
                                  </div>
                               ) : (
                                  <div className="w-full h-full min-h-[60px] hover:bg-zinc-100 rounded-md border border-dashed border-transparent hover:border-zinc-300 transition-colors">
                                  </div>
                               )}
                            </td>
                         ))}
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
         ) : null}
      </div>
    </div>
  );
}
