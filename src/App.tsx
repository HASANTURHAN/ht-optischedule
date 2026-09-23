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
  Map, MousePointer2, Share, CheckCircle2, ChevronRight, PanelLeftClose, PanelLeftOpen
} from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("solve");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans text-zinc-900 overflow-hidden">
      {/* Sleek Sidebar (Collapsible) */}
      <aside className={`${isSidebarCollapsed ? 'w-[72px]' : 'w-[240px]'} transition-all duration-300 ease-in-out bg-[#FAFAFA] border-r border-zinc-200 flex flex-col z-10 shrink-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 shrink-0">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-zinc-900 rounded-[4px] flex items-center justify-center shrink-0">
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            {!isSidebarCollapsed && <h1 className="text-sm font-semibold tracking-tight ml-3 whitespace-nowrap overflow-hidden">HT OptiSchedule</h1>}
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {!isSidebarCollapsed && <SectionTitle>Kurulum</SectionTitle>}
          <NavItem isCollapsed={isSidebarCollapsed} icon={<Database size={18} strokeWidth={2} />} label="Veri Entegrasyonu" isActive={activeTab === "data"} onClick={() => setActiveTab("data")} />
          <NavItem isCollapsed={isSidebarCollapsed} icon={<LayoutGrid size={18} strokeWidth={2} />} label="Kısıt Matrisi" isActive={activeTab === "grid"} onClick={() => setActiveTab("grid")} />
          <NavItem isCollapsed={isSidebarCollapsed} icon={<Map size={18} strokeWidth={2} />} label="Derslik Ağacı" isActive={activeTab === "rooms"} onClick={() => setActiveTab("rooms")} />
          
          {!isSidebarCollapsed && <SectionTitle>Motor</SectionTitle>}
          <NavItem isCollapsed={isSidebarCollapsed} icon={<Settings2 size={18} strokeWidth={2} />} label="AI Motoru" isActive={activeTab === "solve"} onClick={() => setActiveTab("solve")} />
          <NavItem isCollapsed={isSidebarCollapsed} icon={<MousePointer2 size={18} strokeWidth={2} />} label="Manuel Rötuş" isActive={activeTab === "editor"} onClick={() => setActiveTab("editor")} />
          
          {!isSidebarCollapsed && <SectionTitle>Rapor</SectionTitle>}
          <NavItem isCollapsed={isSidebarCollapsed} icon={<BarChart size={18} strokeWidth={2} />} label="İstatistikler" isActive={activeTab === "results"} onClick={() => setActiveTab("results")} />
          <NavItem isCollapsed={isSidebarCollapsed} icon={<Share size={18} strokeWidth={2} />} label="Dışa Aktarım" isActive={activeTab === "export"} onClick={() => setActiveTab("export")} />
        </nav>

        <div className="p-3 border-t border-zinc-200 shrink-0 flex justify-center">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-md hover:bg-zinc-100 text-zinc-500 transition-colors w-full flex justify-center"
            title={isSidebarCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-white">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
             <span>HT OptiSchedule</span>
             <ChevronRight size={14} />
             <span className="font-medium text-zinc-900">
                {activeTab === "data" && "Veri Entegrasyonu"}
                {activeTab === "grid" && "Kısıt Matrisi"}
                {activeTab === "rooms" && "Derslik Ağacı"}
                {activeTab === "duty" && "Nöbet Dağıtım"}
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

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto h-full flex flex-col">
            {activeTab === "data" && <div className="animate-in fade-in duration-300 flex-1"><DataIntegration /></div>}
            {activeTab === "grid" && <div className="animate-in fade-in duration-300 flex-1 h-full"><TeacherGrid /></div>}
            {activeTab === "rooms" && <div className="animate-in fade-in duration-300 flex-1"><Placeholder title="Derslik Ağacı" /></div>}
            {activeTab === "duty" && <div className="animate-in fade-in duration-300 flex-1"><DutySettings /></div>}
            {activeTab === "solve" && <div className="animate-in fade-in duration-300 flex-1"><SolverSettings /></div>}
            {activeTab === "editor" && <div className="animate-in fade-in duration-300 flex-1 h-full"><AdvancedEditor /></div>}
            {activeTab === "results" && <div className="animate-in fade-in duration-300 flex-1"><ResultsDashboard /></div>}
            {activeTab === "export" && <div className="animate-in fade-in duration-300 flex-1"><IntegrationExport /></div>}
          </div>
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-bold text-zinc-400 mt-6 mb-2 px-2 uppercase tracking-wider">{children}</div>;
}

function NavItem({ icon, label, isActive, isCollapsed, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, isCollapsed: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-md transition-all duration-200 text-sm font-medium ${
        isActive 
          ? "bg-zinc-100 text-zinc-900 shadow-sm" 
          : "hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
    </button>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-400">
      <h2 className="text-xl font-medium text-zinc-800">{title}</h2>
      <p className="mt-2 text-sm text-center max-w-md">Bu modül özel tasarım sistemine geçiriliyor.</p>
    </div>
  );
}

export default App;
