import { useState } from "react";
import { MapPin, Plus, Trash2, Building } from "lucide-react";

export default function RoomSettings() {
  const [rooms, setRooms] = useState([
    { id: 1, name: "Bilgisayar Lab-1", type: "Laboratuvar", capacity: 30 },
    { id: 2, name: "Bilgisayar Lab-2", type: "Laboratuvar", capacity: 30 },
    { id: 3, name: "Kapalı Spor Salonu", type: "Spor", capacity: 60 },
    { id: 4, name: "Fizik Lab", type: "Laboratuvar", capacity: 40 },
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Derslik ve Bina Yönetimi</h2>
          <p className="text-slate-500 mt-1">Özel derslikleri tanımlayın ve çakışmaları önleyin.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-indigo-700 shadow-sm">
          <Plus className="w-4 h-4" /> Yeni Derslik Ekle
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="p-4 font-bold">Derslik Adı</th>
                <th className="p-4 font-bold">Tür</th>
                <th className="p-4 font-bold">Kapasite</th>
                <th className="p-4 font-bold text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-indigo-500" /> {room.name}
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{room.type}</span>
                  </td>
                  <td className="p-4 text-slate-600">{room.capacity} Kişi</td>
                  <td className="p-4 text-right">
                    <button className="text-rose-500 hover:text-rose-700 p-2"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4 text-amber-600">
                <Building className="w-5 h-5" />
                <h3 className="font-bold text-slate-800">Bina Geçiş Süresi</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">Farklı binalardaki derslikler arası geçişte öğretmene yürüme payı bırakılsın mı?</p>
              <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                 <span className="font-medium text-sm text-slate-700">Aktif Et</span>
                 <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
              </label>
           </div>
        </div>
      </div>
    </div>
  );
}
