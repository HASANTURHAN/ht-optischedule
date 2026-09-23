import { useState, useEffect } from "react";
import { Hand, Save, AlertTriangle, RefreshCcw, Printer, FileText, Download, CheckCircle2, XCircle } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

export default function AdvancedEditor() {
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [constraintsData, setConstraintsData] = useState<any>(null);
  const [mappingData, setMappingData] = useState<any>(null);
  const [teachers, setTeachers] = useState<string[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [draggedItem, setDraggedItem] = useState<{ dIdx: number, hIdx: number } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [conflictMsg, setConflictMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const scheduleRes = await invoke("get_generated_schedule");
      const parsedSchedule = JSON.parse(scheduleRes as string);
      
      const csvRes = await invoke("get_teachers_data");
      const parsedConstraints = JSON.parse(csvRes as string);
      
      const mapRes = await invoke("get_teacher_mapping");
      const parsedMapping = JSON.parse(mapRes as string);

      setScheduleData(parsedSchedule);
      setConstraintsData(parsedConstraints);
      setMappingData(parsedMapping);

      const tList = Object.keys(parsedSchedule).sort();
      setTeachers(tList);
      if (tList.length > 0) setSelectedEntity(tList[0]);
    } catch (e) {
      console.warn("Error loading data for editor", e);
    }
  };

  const getGrid = () => {
    if (!scheduleData || !selectedEntity || !scheduleData[selectedEntity]) return null;
    const grid = Array(5).fill(null).map(() => Array(8).fill(""));
    const tData = scheduleData[selectedEntity];
    
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

  // Helper to check if a specific day/hour is closed for the selected teacher
  const isSlotClosed = (dIdx: number, hIdx: number) => {
    if (!constraintsData || !mappingData || !selectedEntity) return false;
    const csvName = mappingData[selectedEntity];
    if (!csvName || !constraintsData[csvName]) return false;
    
    const dayStr = ["Pazartesi", "Sali", "Carsamba", "Persembe", "Cuma"][dIdx];
    const teacherConstraints = constraintsData[csvName];
    
    if (teacherConstraints[dayStr] && teacherConstraints[dayStr][(hIdx + 1).toString()] === "Kapali") {
       return true;
    }
    return false;
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

    // VALIDATION: Check if target slot is explicitly closed
    if (isSlotClosed(targetDIdx, targetHIdx)) {
       setConflictMsg("Hata: Öğretmen bu saatte kapalı (Müsait Değil)!");
       setTimeout(() => setConflictMsg(null), 3000);
       setDraggedItem(null);
       return;
    }

    // Create a deep copy of the selected teacher's data to mutate
    const newData = JSON.parse(JSON.stringify(scheduleData));
    const tData = newData[selectedEntity];
    
    const srcDayStr = Object.keys(tData).find(k => k.toLowerCase().startsWith(DAYS[srcD].substring(0, 3).toLowerCase())) || DAYS[srcD];
    const targetDayStr = Object.keys(tData).find(k => k.toLowerCase().startsWith(DAYS[targetDIdx].substring(0, 3).toLowerCase())) || DAYS[targetDIdx];

    if (!tData[srcDayStr]) tData[srcDayStr] = {};
    if (!tData[targetDayStr]) tData[targetDayStr] = {};

    const srcVal = tData[srcDayStr][(srcH + 1).toString()] || "BOŞ";
    const targetVal = tData[targetDayStr][(targetHIdx + 1).toString()] || "BOŞ";

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
    <div className="flex flex-col h-full pb-20 relative">
      {/* Toast Notification for Conflict */}
      {conflictMsg && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-red-900 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-in slide-in-from-top-4">
           <XCircle className="w-4 h-4 text-red-200" />
           <span className="text-sm font-semibold">{conflictMsg}</span>
        </div>
      )}

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
         <button onClick={loadData} className="p-1.5 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 shadow-sm" title="Orijinal Programa Dön">
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
                         {grid[dIdx].map((lesson, hIdx) => {
                            const closed = isSlotClosed(dIdx, hIdx);
                            return (
                                <td 
                                  key={hIdx} 
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleDrop(e, dIdx, hIdx)}
                                  className={`border-b border-r last:border-r-0 border-zinc-200 p-1.5 relative group ${closed ? 'bg-zinc-100/50 striped-bg' : 'bg-zinc-50/20'}`}
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
                                      <div className={`w-full h-full min-h-[60px] rounded-md border border-dashed border-transparent transition-colors ${closed ? '' : 'hover:bg-zinc-100 hover:border-zinc-300'}`}>
                                          {closed && <div className="w-full h-full flex justify-center items-center opacity-20"><AlertTriangle className="w-4 h-4" /></div>}
                                      </div>
                                   )}
                                </td>
                            );
                         })}
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
