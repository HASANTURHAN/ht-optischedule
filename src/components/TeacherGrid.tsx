import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Search, Save, RotateCcw, Check, Lock } from "lucide-react";

const TR_DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
const DAYS = ["Pazartesi", "Sali", "Carsamba", "Persembe", "Cuma"];

export default function TeacherGrid() {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  
  // grid[d][h] where d is 0..4 and h is 0..7
  const [allGrids, setAllGrids] = useState<Record<string, number[][]>>({});

  useEffect(() => {
    Promise.all([
      invoke("get_teachers_data"),
      invoke("get_teacher_mapping")
    ]).then(([csvRes, mapRes]: [any, any]) => {
      const csvData = JSON.parse(csvRes);
      const mapping = JSON.parse(mapRes);
      
      // Sadece Aktif Öğretmenler (curriculum'da dersi olanlar)
      const activeTeacherNames = Object.keys(mapping).sort();
      setTeachers(activeTeacherNames);
      
      if (activeTeacherNames.length > 0) {
        setSelectedTeacher(activeTeacherNames[0]);
      }

      const initialGrids: Record<string, number[][]> = {};
      
      for (const activeName of activeTeacherNames) {
        const csvName = mapping[activeName];
        const tGrid = Array(5).fill(null).map(() => Array(8).fill(0));
        
        if (csvName && csvData[csvName]) {
          const tData = csvData[csvName];
          DAYS.forEach((day, dIdx) => {
            if (tData[day]) {
              for (let p = 1; p <= 8; p++) {
                if (tData[day][p.toString()] === "Kapali") {
                  tGrid[dIdx][p - 1] = 1;
                }
              }
            }
          });
        }
        initialGrids[activeName] = tGrid;
      }
      
      setAllGrids(initialGrids);
    }).catch(err => console.error("Data load error", err));
  }, []);

  const toggleCell = (d: number, h: number) => {
    if (!selectedTeacher) return;
    const currentGrid = allGrids[selectedTeacher];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[d][h] = newGrid[d][h] === 0 ? 1 : 0;
    
    setAllGrids({
      ...allGrids,
      [selectedTeacher]: newGrid
    });
  };

  const filteredTeachers = teachers.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
  const grid = selectedTeacher ? allGrids[selectedTeacher] : null;

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel: Teacher List */}
      <div className="w-72 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col h-full overflow-hidden shrink-0">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-zinc-900">Öğretmenler</h2>
            <div className="flex items-center gap-2">
              <span className="bg-zinc-100 text-zinc-700 text-[10px] font-bold px-2 py-1 rounded-md">
                {teachers.length} Aktif
              </span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -tranzinc-y-1/2 text-zinc-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="İsim ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-1000 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {filteredTeachers.map(t => (
            <button 
              key={t}
              onClick={() => setSelectedTeacher(t)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                selectedTeacher === t 
                  ? 'bg-zinc-100 text-zinc-800' 
                  : 'hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Grid Editor */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col overflow-hidden">
        {grid ? (
          <>
            <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">{selectedTeacher}</h2>
                <p className="text-xs text-zinc-500 mt-1">Hücrelere tıklayarak saatleri kapatıp açabilirsiniz.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-4 text-xs font-semibold bg-white px-3 py-1.5 rounded-md border border-zinc-200 shadow-sm">
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <Check className="w-3.5 h-3.5" /> Müsait
                  </span>
                  <span className="w-px h-4 bg-zinc-200"></span>
                  <span className="flex items-center gap-1.5 text-rose-500">
                    <Lock className="w-3.5 h-3.5" /> Kapalı
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-zinc-200 pl-4">
                  <button className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50 shadow-sm" title="Matrisi Yazdır">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                  </button>
                  <button className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50 shadow-sm" title="Excel'e Aktar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-zinc-50/30">
              <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm w-full h-full bg-white flex flex-col">
                <table className="w-full h-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-r border-zinc-200 p-3 bg-zinc-50 text-zinc-500 font-bold text-sm w-32">Günler / Saatler</th>
                      {Array(8).fill(0).map((_, h) => (
                        <th key={h} className="border-b border-r last:border-r-0 border-zinc-200 p-3 bg-zinc-50 text-zinc-700 font-bold text-sm">
                          {h + 1}. Ders
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TR_DAYS.map((dayName, d) => (
                      <tr key={d} className="group">
                        <td className="border-b border-r border-zinc-200 p-3 text-left font-bold text-zinc-600 bg-zinc-50/50 group-hover:bg-zinc-100 transition-colors">
                          {dayName}
                        </td>
                        {Array(8).fill(0).map((_, h) => {
                          const isClosed = grid[d][h] === 1;
                          return (
                            <td 
                              key={h} 
                              onClick={() => toggleCell(d, h)}
                              className={`border-b border-r last:border-r-0 border-zinc-200 p-2 cursor-pointer transition-all duration-200 ${
                                isClosed 
                                  ? 'bg-rose-50 hover:bg-rose-100' 
                                  : 'hover:bg-zinc-50'
                              }`}
                            >
                              <div className={`flex flex-col items-center justify-center py-2 rounded-lg transition-colors h-full ${
                                isClosed ? 'text-rose-600' : 'text-emerald-500'
                              }`}>
                                {isClosed ? <Lock className="w-5 h-5 mb-1" /> : <Check className="w-5 h-5 mb-1 opacity-20" />}
                                <span className="text-xs font-semibold tracking-wide uppercase">
                                  {isClosed ? 'KAPALI' : 'Müsait'}
                                </span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3">
              <button 
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-sm"
                onClick={() => {
                  if (selectedTeacher) {
                     setAllGrids({...allGrids, [selectedTeacher]: Array(5).fill(null).map(() => Array(8).fill(0))});
                  }
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Tümünü Müsait Yap
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors shadow-md shadow-indigo-200">
                <Save className="w-4 h-4" />
                Değişiklikleri Kaydet
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
             <Search className="w-12 h-12 mb-4 opacity-20" />
             <p className="text-lg font-medium">Lütfen sol menüden bir öğretmen seçiniz</p>
          </div>
        )}
      </div>
    </div>
  );
}
