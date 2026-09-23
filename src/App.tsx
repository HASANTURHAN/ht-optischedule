import { useState } from "react";
import "./index.css";
import TeacherGrid from "./components/TeacherGrid";
import SolverSettings from "./components/SolverSettings";
import DutySettings from "./components/DutySettings";
import ResultsDashboard from "./components/ResultsDashboard";
import AdvancedEditor from "./components/AdvancedEditor";
import IntegrationExport from "./components/IntegrationExport";
import DataIntegration from "./components/DataIntegration";
import { 
  Database, LayoutGrid, Settings2, BarChart, 
  Map, MousePointer2, Share, CheckCircle2, ChevronRight
} from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("solve");

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans text-zinc-900 overflow-hidden">
      {/* Sleek Sidebar (Vercel/Linear style) */}
      <aside className="w-[260px] bg-[#FAFAFA] border-r border-zinc-200 flex flex-col z-10 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <div className="w-6 h-6 bg-zinc-900 rounded-[4px] flex items-center justify-center mr-3">
             <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <h1 className="text-sm font-semibold tracking-tight">HT OptiSchedule</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <SectionTitle>Kurulum & Veri</SectionTitle>
          <NavItem icon={<Database size={16} strokeWidth={2} />} label="Veri Entegrasyonu" isActive={activeTab === "data"} onClick={() => setActiveTab("data")} />
          <NavItem icon={<LayoutGrid size={16} strokeWidth={2} />} label="Kısıt Matrisi" isActive={activeTab === "grid"} onClick={() => setActiveTab("grid")} />
          <NavItem icon={<Map size={16} strokeWidth={2} />} label="Derslik Ağacı" isActive={activeTab === "rooms"} onClick={() => setActiveTab("rooms")} />
          
          <SectionTitle>Optimizasyon</SectionTitle>
          <NavItem icon={<Settings2 size={16} strokeWidth={2} />} label="AI Motoru" isActive={activeTab === "solve"} onClick={() => setActiveTab("solve")} />
          <NavItem icon={<MousePointer2 size={16} strokeWidth={2} />} label="Manuel Rötuş" isActive={activeTab === "editor"} onClick={() => setActiveTab("editor")} />
          
          <SectionTitle>Raporlama</SectionTitle>
          <NavItem icon={<BarChart size={16} strokeWidth={2} />} label="İstatistikler" isActive={activeTab === "results"} onClick={() => setActiveTab("results")} />
          <NavItem icon={<Share size={16} strokeWidth={2} />} label="Dışa Aktarım" isActive={activeTab === "export"} onClick={() => setActiveTab("export")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
             <span>HT OptiSchedule</span>
             <ChevronRight size={14} />
             <span className="font-medium text-zinc-900">
                {activeTab === "data" && "Veri Entegrasyonu"}
                {activeTab === "grid" && "Kısıt Matrisi"}
                {activeTab === "rooms" && "Derslik Ağacı"}
                {activeTab === "solve" && "AI Motoru ve Doğrulama"}
                {activeTab === "editor" && "İnteraktif Program Düzenleyici"}
                {activeTab === "results" && "İstatistik ve Analiz"}
                {activeTab === "export" && "Dışa Aktarım Merkezi"}
             </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium border border-zinc-200 bg-zinc-50 px-3 py-1.5 rounded-full">
             <CheckCircle2 size={14} className="text-emerald-500" />
             <span>Sistem Aktif</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1000px] mx-auto h-full">
            {activeTab === "data" && <div className="animate-in fade-in duration-300"><DataIntegration /></div>}
            {activeTab === "grid" && <div className="h-full pb-4 animate-in fade-in duration-300"><TeacherGrid /></div>}
            {activeTab === "rooms" && <Placeholder title="Derslik Ağacı" />}
            {activeTab === "duty" && <div className="animate-in fade-in duration-300"><DutySettings /></div>}
            {activeTab === "solve" && <div className="animate-in fade-in duration-300"><SolverSettings /></div>}
            {activeTab === "editor" && <div className="animate-in h-full fade-in duration-300"><AdvancedEditor /></div>}
            {activeTab === "results" && <div className="animate-in fade-in duration-300"><ResultsDashboard /></div>}
            {activeTab === "export" && <div className="animate-in fade-in duration-300"><IntegrationExport /></div>}
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold text-zinc-400 mt-6 mb-2 px-3 uppercase tracking-wider">{children}</div>;
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
        isActive 
          ? "bg-zinc-100 text-zinc-900" 
          : "hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900"
      }`}
    >
      {icon}<span>{label}</span>
    </button>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-400 animate-in fade-in duration-300">
      <h2 className="text-xl font-medium text-zinc-800">{title}</h2>
      <p className="mt-2 text-sm text-center max-w-md">Bu modül özel tasarım sistemine geçiriliyor.</p>
    </div>
  );
}

export default App;
