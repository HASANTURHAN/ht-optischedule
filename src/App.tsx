import { useState } from "react";
import "./index.css";
import TeacherGrid from "./components/TeacherGrid";
import SolverSettings from "./components/SolverSettings";
import DutySettings from "./components/DutySettings";
import ResultsDashboard from "./components/ResultsDashboard";
import AdvancedEditor from "./components/AdvancedEditor";
import IntegrationExport from "./components/IntegrationExport";
import { 
  LayoutDashboard, Upload, CalendarDays, Settings, 
  Scale, GraduationCap, ShieldAlert, PieChart, 
  Map, Edit3, Share2
} from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-10 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">HT OptiSchedule</h1>
            <p className="text-xs text-indigo-400 font-medium">Yeni Nesil Bilişim</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-500 mb-2 mt-2 px-2 uppercase tracking-wider">Veri Yönetimi</div>
          <NavItem icon={<Upload size={18} />} label="Veri İçe Aktarım" isActive={activeTab === "data"} onClick={() => setActiveTab("data")} />
          
          <div className="text-xs font-bold text-slate-500 mb-2 mt-6 px-2 uppercase tracking-wider">Kısıtlamalar</div>
          <NavItem icon={<CalendarDays size={18} />} label="Öğretmen Matrisi" isActive={activeTab === "grid"} onClick={() => setActiveTab("grid")} />
          <NavItem icon={<Map size={18} />} label="Derslik & Bina Ayarları" isActive={activeTab === "rooms"} onClick={() => setActiveTab("rooms")} />
          <NavItem icon={<ShieldAlert size={18} />} label="Nöbet & Görevler" isActive={activeTab === "duty"} onClick={() => setActiveTab("duty")} />
          
          <div className="text-xs font-bold text-slate-500 mb-2 mt-6 px-2 uppercase tracking-wider">Yapay Zeka Motoru</div>
          <NavItem icon={<Settings size={18} />} label="Algoritma ve Çözüm" isActive={activeTab === "solve"} onClick={() => setActiveTab("solve")} />
          
          <div className="text-xs font-bold text-slate-500 mb-2 mt-6 px-2 uppercase tracking-wider">Sonuç ve Raporlama</div>
          <NavItem icon={<Edit3 size={18} />} label="Manuel Rötuş (Sürükle)" isActive={activeTab === "editor"} onClick={() => setActiveTab("editor")} />
          <NavItem icon={<PieChart size={18} />} label="İstatistik & Grafikler" isActive={activeTab === "results"} onClick={() => setActiveTab("results")} />
          <NavItem icon={<Share2 size={18} />} label="Dışa Aktar & MEB e-Okul" isActive={activeTab === "export"} onClick={() => setActiveTab("export")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">
            {activeTab === "data" && "Veri Kaynakları & e-Okul Senkronizasyonu"}
            {activeTab === "grid" && "Öğretmen Kısıtlama Matrisi"}
            {activeTab === "rooms" && "Fiziksel Mekan ve Sınıf Yönetimi"}
            {activeTab === "duty" && "Nöbet Dağıtım ve Planlama"}
            {activeTab === "solve" && "Yapay Zeka Motoru (OR-Tools)"}
            {activeTab === "editor" && "İnteraktif Program Düzenleyici"}
            {activeTab === "results" && "Optimizasyon Sonuçları"}
            {activeTab === "export" && "Dışa Aktarım Merkezi"}
          </h2>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-sm text-slate-500 font-medium">AI Engine Hazır</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            
            {activeTab === "data" && (
              <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4 items-start">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Upload className="w-6 h-6" /></div>
                   <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800">e-Okul XML Entegrasyonu</h3>
                      <p className="text-sm text-slate-500 mt-1 mb-4">MEB e-Okul sisteminden dışa aktardığınız XML veya XLS dosyasını yükleyerek tüm sınıfları ve ders yüklerini tek tıkla alın.</p>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm">Dosya Seç</button>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-4 items-start opacity-70">
                   <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Upload className="w-6 h-6" /></div>
                   <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800">Bilsa a.txt / Özel CSV Yükleme</h3>
                      <p className="text-sm text-slate-500 mt-1 mb-4">Eski programınızdaki kısıtlamaları (Hasan Turhan CSV formatı) korumak için burayı kullanın.</p>
                      <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-lg shadow-sm">Dosya Seç</button>
                   </div>
                </div>
              </div>
            )}
            
            {activeTab === "grid" && <div className="h-full pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500"><TeacherGrid /></div>}
            
            {activeTab === "rooms" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center h-full text-slate-400">
                 <Map size={48} className="mb-4 opacity-50" />
                 <h2 className="text-xl font-medium">Bina, Laboratuvar ve Beden Eğitimi Kısıtları</h2>
                 <p className="mt-2 text-center max-w-md">Spor salonu kapasitesi, bilgisayar laboratuvarı çakışmaları ve iki bina arası yürüme süresi (Seyahat molası) kısıtlamaları buradan eklenecektir.</p>
              </div>
            )}

            {activeTab === "duty" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><DutySettings /></div>}
            
            {activeTab === "solve" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><SolverSettings /></div>}
            
            {activeTab === "editor" && <div className="animate-in h-full fade-in slide-in-from-bottom-4 duration-500"><AdvancedEditor /></div>}

            {activeTab === "results" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><ResultsDashboard /></div>}

            {activeTab === "export" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><IntegrationExport /></div>}
            
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-900/20" : "hover:bg-slate-800 hover:text-white text-slate-400"}`}>
      {icon}<span className="text-sm">{label}</span>
    </button>
  );
}

export default App;
