import { useState } from "react";
import { MapPin, Plus, Trash2, Building, Printer, Download } from "lucide-react";

export default function RoomSettings() {
  const [rooms, setRooms] = useState([
    { id: 1, name: "Bilgisayar Lab-1", type: "Laboratuvar", capacity: 30 },
    { id: 2, name: "Bilgisayar Lab-2", type: "Laboratuvar", capacity: 30 },
    { id: 3, name: "Kapalı Spor Salonu", type: "Spor", capacity: 60 },
    { id: 4, name: "Fizik Lab", type: "Laboratuvar", capacity: 40 },
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Derslik ve Bina Yönetimi</h2>
          <p className="text-sm text-zinc-500 mt-1">Özel derslikleri tanımlayın ve çakışmaları önleyin.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border-r border-zinc-200 pr-3">
             <button className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm" title="Listeyi Yazdır">
               <Printer size={16} />
             </button>
             <button className="p-1.5 bg-white border border-zinc-200 rounded text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm" title="Excel İndir">
               <Download size={16} />
             </button>
          </div>
          <button className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-md text-xs font-semibold text-white hover:bg-zinc-800 shadow-sm">
            <Plus className="w-4 h-4" /> Yeni Derslik
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs">
                <th className="p-4 font-semibold">Derslik Adı</th>
                <th className="p-4 font-semibold">Tür</th>
                <th className="p-4 font-semibold">Kapasite</th>
                <th className="p-4 font-semibold text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="p-4 font-medium text-sm text-zinc-900 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-zinc-400" /> {room.name}
                  </td>
                  <td className="p-4 text-zinc-600">
                    <span className="bg-white border border-zinc-200 px-2 py-1 rounded-md text-[10px] font-bold">{room.type}</span>
                  </td>
                  <td className="p-4 text-sm text-zinc-600">{room.capacity} Kişi</td>
                  <td className="p-4 text-right">
                    <button className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
              <div className="flex items-center gap-2 mb-4 text-zinc-900">
                <Building className="w-4 h-4" />
                <h3 className="font-semibold text-sm">Bina Geçiş Süresi</h3>
              </div>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Farklı binalardaki derslikler arası geçişte öğretmene yürüme payı bırakılsın mı?</p>
              <label className="flex items-center justify-between p-3 border border-zinc-200 rounded-lg cursor-pointer hover:bg-zinc-50">
                 <span className="font-medium text-xs text-zinc-700">Aktif Et</span>
                 <input type="checkbox" className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900" />
              </label>
           </div>
        </div>
      </div>
    </div>
  );
}
