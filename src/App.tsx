import { useState } from "react";
import "./index.css";
import TeacherGrid from "./components/TeacherGrid";
import SolverSettings from "./components/SolverSettings";
import DutySettings from "./components/DutySettings";
import ResultsDashboard from "./components/ResultsDashboard";
import { LayoutDashboard, Upload, CalendarDays, Settings, Scale, GraduationCap, ShieldAlert, PieChart } from "lucide-react";

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
            <p className="text-xs text-indigo-400 font-medium">Sıfır Karnı Yarık</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" isActive={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          <NavItem icon={<Upload size={18} />} label="Veri Yükleme" isActive={activeTab === "data"} onClick={() => setActiveTab("data")} />
          <NavItem icon={<CalendarDays size={18} />} label="Öğretmen Matrisi" isActive={activeTab === "grid"} onClick={() => setActiveTab("grid")} />
          <NavItem icon={<ShieldAlert size={18} />} label="Nöbet Sistemi" isActive={activeTab === "duty"} onClick={() => setActiveTab("duty")} />
          <NavItem icon={<Settings size={18} />} label="Optimizasyon" isActive={activeTab === "solve"} onClick={() => setActiveTab("solve")} />
          <NavItem icon={<PieChart size={18} />} label="Sonuçlar & Çıktılar" isActive={activeTab === "results"} onClick={() => setActiveTab("results")} />
          <NavItem icon={<Scale size={18} />} label="Karşılaştırma" isActive={activeTab === "compare"} onClick={() => setActiveTab("compare")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">
            {activeTab === "dashboard" && "Yönetim Paneli"}
            {activeTab === "data" && "Veri Kaynakları"}
            {activeTab === "grid" && "Öğretmen Kısıtlama Matrisi"}
            {activeTab === "duty" && "Nöbet Dağıtım ve Planlama"}
            {activeTab === "solve" && "Yapay Zeka Motoru"}
            {activeTab === "results" && "Optimizasyon Sonuçları"}
            {activeTab === "compare" && "Program Karşılaştırma"}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === "dashboard" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-slate-500 mb-8 text-lg">Okulunuzun ders programını yapay zeka ile kusursuzlaştırın.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <StatCard title="Kayıtlı Öğretmen" value="74" color="bg-blue-500" />
                   <StatCard title="Toplam Ders Saati" value="1,612" color="bg-emerald-500" />
                   <StatCard title="Son Optimizasyon KY" value="16" color="bg-indigo-500" />
                </div>
              </div>
            )}
            
            {activeTab === "data" && (
              <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <DataCard title="Bilsa a.txt Dosyası (Öğretmen ve Ders Yükü)" color="blue" />
                <DataCard title="Özel Kısıtlamalar (CSV Formatı)" color="emerald" />
              </div>
            )}
            
            {activeTab === "grid" && <div className="h-full pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500"><TeacherGrid /></div>}
            
            {activeTab === "duty" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><DutySettings /></div>}
            
            {activeTab === "solve" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><SolverSettings /></div>}
            
            {activeTab === "results" && <div className="animate-in fade-in slide-in-from-bottom-4 duration-500"><ResultsDashboard /></div>}

            {activeTab === "compare" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center h-full text-slate-400">
                 <Scale size={48} className="mb-4 opacity-50" />
                 <h2 className="text-xl font-medium">A/B Program Karşılaştırması Yapım Aşamasında</h2>
                 <p className="mt-2">Önceki optimizasyon sonuçlarını burada yan yana görebileceksiniz.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-900/20" : "hover:bg-slate-800 hover:text-white text-slate-400"}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
      <div className={`absolute left-0 top-0 w-1 h-full ${color}`}></div>
      <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
      <p className="text-4xl font-bold mt-3 text-slate-800">{value}</p>
    </div>
  );
}

function DataCard({ title, color }: { title: string, color: "blue" | "emerald" }) {
  const colorClasses = color === "blue" ? "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border-blue-100" : "file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border-emerald-100";
  return (
    <div className={`p-6 bg-white rounded-2xl shadow-sm border ${colorClasses}`}>
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>
      <input type="file" className={`block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold transition-colors cursor-pointer ${colorClasses}`} />
    </div>
  );
}

export default App;
