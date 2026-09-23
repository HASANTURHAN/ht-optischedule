import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { Cpu, Clock, Rocket, ShieldCheck, Zap, Terminal } from "lucide-react";

export default function SolverSettings() {
  const [cpu, setCpu] = useState(50);
  const [time, setTime] = useState(5);
  const [isSolving, setIsSolving] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const unlistenLog = listen("solver-log", (event) => {
      setLogs(prev => [...prev, event.payload as string]);
    });
    
    const unlistenDone = listen("solver-done", (event) => {
      setLogs(prev => [...prev, event.payload as string]);
      setIsSolving(false);
    });

    return () => {
      unlistenLog.then(f => f());
      unlistenDone.then(f => f());
    };
  }, []);

  const handleStart = async () => {
    setIsSolving(true);
    setLogs([]);
    try {
      await invoke("start_solver", { timeLimit: time, cpuLimit: cpu });
    } catch (e) {
      console.error(e);
      setLogs(prev => [...prev, "Hata: " + e]);
      setIsSolving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engine Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Motor Performansı</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <label className="flex justify-between items-end mb-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock className="w-4 h-4 text-slate-400" /> 
                  Hesaplama Süresi
                </span>
                <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full text-sm">{time} Dakika</span>
              </label>
              <input 
                type="range" min="1" max="60" value={time} 
                onChange={(e) => setTime(Number(e.target.value))}
                disabled={isSolving}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-xs text-slate-500 mt-2">Süre ne kadar uzun olursa, Karnı Yarık oranı o kadar mükemmelleşir.</p>
            </div>

            <div>
              <label className="flex justify-between items-end mb-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Cpu className="w-4 h-4 text-slate-400" /> 
                  İşlemci (CPU) Sınırı
                </span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm">% {cpu}</span>
              </label>
              <input 
                type="range" min="10" max="100" step="10" value={cpu} 
                onChange={(e) => setCpu(Number(e.target.value))}
                disabled={isSolving}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-xs text-slate-500 mt-2">Çalışırken bilgisayarınızın kasmasını engellemek için sınır koyun.</p>
            </div>
          </div>
        </div>

        {/* Rules Engine */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Yapay Zeka Kuralları</h2>
          </div>

          <div className="space-y-4">
            <ToggleOption title="Yarım Günleri Kenara İt" desc="Dersleri sabah 1'e veya akşam 8'e yaslar." defaultOn={true} disabled={isSolving} />
            <ToggleOption title="Kusursuz 4 Gün Kuralı" desc="Öğretmenleri istisnasız 4 gün okula getirir." defaultOn={true} disabled={isSolving} />
            <ToggleOption title="Hasan Turhan VIP Kuralı" desc="Pazartesi boş bırakılır, Cuma erken biter." defaultOn={true} disabled={isSolving} />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 shadow-xl shadow-slate-900/20 mt-8 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
        
        <div className="flex-1 relative z-10 text-center md:text-left">
          <Rocket className="w-12 h-12 text-indigo-400 mb-4 mx-auto md:mx-0" />
          <h2 className="text-2xl font-bold text-white mb-2">Optimizasyonu Başlat</h2>
          <p className="text-slate-400 mb-6">
            Tüm kısıtlamalarınız ve kurallarınız OR-Tools motoruna gönderilecek. Arka planda canlı sonuçları yandaki terminalden izleyebilirsiniz.
          </p>
          <button 
            onClick={handleStart}
            disabled={isSolving}
            className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
              isSolving 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/30 hover:scale-105 active:scale-95'
            }`}
          >
            {isSolving ? 'Hesaplanıyor...' : 'Programı Oluştur'}
          </button>
        </div>

        {/* Live Terminal Log */}
        <div className="w-full md:w-96 h-64 bg-black/50 border border-slate-700 rounded-xl relative z-10 p-4 flex flex-col">
           <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
             <Terminal className="w-4 h-4 text-emerald-400" />
             <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Canlı AI Motoru</span>
             {isSolving && <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
           </div>
           <div className="flex-1 overflow-y-auto font-mono text-[10px] sm:text-xs text-slate-300 space-y-1 custom-scrollbar flex flex-col">
              {logs.length === 0 ? (
                <div className="text-slate-600 m-auto">Sistem Hazır. Başlatılması Bekleniyor...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`${log.includes("Hata") ? "text-rose-400" : log.includes("Çözüm") ? "text-emerald-400" : ""}`}>
                    {log}
                  </div>
                ))
              )}
           </div>
        </div>
      </div>

    </div>
  );
}

function ToggleOption({ title, desc, defaultOn, disabled }: { title: string, desc: string, defaultOn: boolean, disabled: boolean }) {
  const [isOn, setIsOn] = useState(defaultOn);
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl transition-colors border border-transparent ${disabled ? 'opacity-50' : 'hover:bg-slate-50 hover:border-slate-100'}`}>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
      <button 
        onClick={() => !disabled && setIsOn(!isOn)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
