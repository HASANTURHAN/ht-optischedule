import { useState } from "react";
import { Cpu, Clock, Rocket, ShieldCheck, Zap } from "lucide-react";

export default function SolverSettings() {
  const [cpu, setCpu] = useState(50);
  const [time, setTime] = useState(5);

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
            <ToggleOption 
              title="Yarım Günleri Kenara İt" 
              desc="Öğretmenlerin az dersi olduğu günlerde dersleri gün ortasına değil, mecburen sabah 1'e veya akşam 8'e yaslar." 
              defaultOn={true} 
            />
            <ToggleOption 
              title="Kusursuz 4 Gün Kuralı" 
              desc="Özel kısıtlaması olmayan tüm öğretmenleri istisnasız 4 gün okula getirir (Yapay zeka kaçamak yapamaz)." 
              defaultOn={true} 
            />
            <ToggleOption 
              title="Hasan Turhan VIP Kuralı" 
              desc="Pazartesi günü tamamen boş bırakılır, Cuma günü dersler erken saatlerde bitirilir." 
              defaultOn={true} 
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-center shadow-xl shadow-slate-900/20 mt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
        <Rocket className="w-12 h-12 text-indigo-400 mx-auto mb-4 relative z-10" />
        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Optimizasyonu Başlat</h2>
        <p className="text-slate-400 mb-6 relative z-10 max-w-lg mx-auto">
          Tüm kısıtlamalarınız ve kurallarınız OR-Tools motoruna gönderilecek. İşlem sırasında arka planda canlı sonuçları izleyebileceksiniz.
        </p>
        <button className="relative z-10 bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95">
          Programı Oluştur
        </button>
      </div>

    </div>
  );
}

function ToggleOption({ title, desc, defaultOn }: { title: string, desc: string, defaultOn: boolean }) {
  const [isOn, setIsOn] = useState(defaultOn);
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className="flex-1">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOn ? 'bg-indigo-600' : 'bg-slate-200'}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
