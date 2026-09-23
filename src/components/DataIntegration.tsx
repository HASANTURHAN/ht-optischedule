import { useState } from "react";
import { Upload, FileText, Database, CheckCircle2 } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { open } from '@tauri-apps/plugin-dialog';

export default function DataIntegration() {
  const [status, setStatus] = useState<"idle" | "uploading" | "success">("idle");
  const [log, setLog] = useState("");

  const handleUpload = async () => {
     try {
       // Open a native file picker
       const file = await open({
         multiple: false,
         filters: [{
           name: 'Bilsa Export',
           extensions: ['txt', 'csv']
         }]
       });
       
       if (!file) {
         return; // User cancelled
       }
       
       setStatus("uploading");
       setLog("Dosya okundu, veriler parçalanıyor (Parsing)...");
       
       // Call Rust to process the file
       const result = await invoke('process_bilsa_file', { path: file.path || file });

       setLog(`Veri başarıyla işlendi: ${result}`);
       setStatus("success");

     } catch (err) {
       console.error(err);
       setStatus("idle");
       alert("Dosya yüklenirken bir hata oluştu.");
     }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Veri Entegrasyonu</h2>
        <p className="text-sm text-zinc-500 mt-1">Bilsa, e-Okul veya özel CSV dosyalarınızı sisteme aktarın.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* e-Okul Entegrasyonu */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col">
           <div className="p-3 bg-zinc-50 text-zinc-800 rounded-lg w-fit mb-4 border border-zinc-100">
             <Database className="w-5 h-5" />
           </div>
           <h3 className="font-bold text-sm text-zinc-900">e-Okul XML Senkronizasyonu</h3>
           <p className="text-xs text-zinc-500 mt-2 mb-6 flex-1">MEB e-Okul sisteminden indirdiğiniz güncel öğrenci, sınıf ve ders yükü XML tablosunu sisteme tek tıkla yükleyin.</p>
           <button className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-2">
             <Upload className="w-3.5 h-3.5" /> XML Dosyası Seç
           </button>
        </div>

        {/* Bilsa a.txt */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col relative overflow-hidden">
           {status === "success" && (
             <div className="absolute inset-0 bg-emerald-50/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center border border-emerald-200 p-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <span className="text-sm font-bold text-emerald-800">Aktarım Başarılı</span>
                <span className="text-xs text-emerald-600 mt-1 text-center leading-relaxed">{log}</span>
             </div>
           )}
           <div className="p-3 bg-zinc-50 text-zinc-800 rounded-lg w-fit mb-4 border border-zinc-100">
             <FileText className="w-5 h-5" />
           </div>
           <h3 className="font-bold text-sm text-zinc-900">Bilsa TXT Aktarımı (a.txt)</h3>
           <p className="text-xs text-zinc-500 mt-2 mb-6 flex-1">Eski Bilsa programınızdaki tüm kısıtlamaları, öğretmen ders dağılımlarını ve curriculum verisini kayıpsız aktarın.</p>
           <button 
             onClick={handleUpload}
             className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
           >
             {status === "uploading" ? (
                <span className="flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin"></span>
                   Yükleniyor...
                </span>
             ) : (
                <><Upload className="w-3.5 h-3.5" /> a.txt Dosyası Seç</>
             )}
           </button>
        </div>

      </div>
    </div>
  );
}
