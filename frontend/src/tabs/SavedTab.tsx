import { useState } from 'react';

const API_URL = 'https://bibleonbot-backend.rchtxtdev.workers.dev/api';

export default function SavedTab({ savedVerses, fetchSaved }: any) {
  const [viewMode, setViewMode] = useState<'notes' | 'highlights'>('notes');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]); // Untuk Hapus Instan (Tanpa Lag)
  
  const COLOR_BORDER_MAP: any = { 'yellow': 'bg-yellow-400', 'green': 'bg-green-400', 'blue': 'bg-blue-400', 'pink': 'bg-pink-400', 'purple': 'bg-purple-400', '': 'bg-gray-200' };
  const COLOR_TEXT_MAP: any = { 'yellow': 'bg-[#fef08a]/50 text-yellow-900 rounded-md px-1', 'green': 'bg-[#bbf7d0]/50 text-green-900 rounded-md px-1', 'blue': 'bg-[#bfdbfe]/50 text-blue-900 rounded-md px-1', 'pink': 'bg-[#fbcfe8]/50 text-pink-900 rounded-md px-1', 'purple': 'bg-[#e9d5ff]/50 text-purple-900 rounded-md px-1', '': 'text-gray-800' };

  const removeSavedVerse = async (id: number) => {
    if (!confirm('Hapus ayat ini dari daftar tersimpan?')) return;
    
    // 1. Mulai animasi CSS memudar & bergeser (ringan di GPU)
    setDeletingId(id);
    
    // 2. Tunggu 300ms (Sesuai durasi CSS transition), lalu sembunyikan instan
    setTimeout(async () => {
      setHiddenIds(prev => [...prev, id]);
      
      try {
        // 3. Hapus di server secara diam-diam (Background sync)
        await fetch(`${API_URL}/saved-verses?id=${id}&t=${Date.now()}`, { method: 'DELETE' });
        fetchSaved(); 
      } catch (e) {
        console.error(e);
        // Jika internet mati, kembalikan ayatnya
        setHiddenIds(prev => prev.filter(hid => hid !== id));
      }
      setDeletingId(null);
    }, 300);
  };

  // Menyembunyikan id yang masuk daftar hiddenIds
  const versesWithNotes = savedVerses.filter((v: any) => v.note && v.note.trim() !== '' && !hiddenIds.includes(v.id)).sort((a: any, b: any) => b.id - a.id);
  const versesWithHighlights = savedVerses.filter((v: any) => (!v.note || v.note.trim() === '') && v.color && !hiddenIds.includes(v.id)).sort((a: any, b: any) => b.id - a.id);

  const displayedVerses = viewMode === 'notes' ? versesWithNotes : versesWithHighlights;

  return (
    <div className="animate-fadeIn px-5 pt-4 pb-10">
      <div className="mb-6">
        <h2 className="font-extrabold text-2xl tracking-tight text-gray-900">Tersimpan</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-1">Koleksi firman dan renungan pribadi Anda.</p>
      </div>

      <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl mb-6">
        <button onClick={() => setViewMode('notes')} className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-300 ${viewMode === 'notes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Dengan Catatan ({versesWithNotes.length})</button>
        <button onClick={() => setViewMode('highlights')} className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-300 ${viewMode === 'highlights' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Sorotan Warna ({versesWithHighlights.length})</button>
      </div>

      {displayedVerses.length > 0 ? (
        <div className="space-y-4">
          {displayedVerses.map((v: any) => (
            <div 
              key={v.id} 
              // Animasi transform CSS ini 100% menggunakan hardware acceleration (GPU friendly) tanpa blur
              className={`bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-sm relative group transition-all duration-300 origin-right ${deletingId === v.id ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-[1.25rem] ${COLOR_BORDER_MAP[v.color] || COLOR_BORDER_MAP['']}`}></div>
              
              <div className="flex justify-between items-start mb-3 pl-2">
                <span className="bg-gray-50 border border-gray-200 text-gray-800 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest">{v.book} {v.chapter}:{v.verse}</span>
                <button onClick={() => removeSavedVerse(v.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <i className="ph-bold ph-trash text-sm"></i>
                </button>
              </div>
              
              <p className={`text-[14px] leading-relaxed pl-2 mb-4 font-medium ${COLOR_TEXT_MAP[v.color] || COLOR_TEXT_MAP['']}`}>{v.content}</p>
              
              {v.note && (
                <div className="ml-2 bg-[#fafafa] rounded-xl p-4 border border-gray-100 relative">
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-gray-300 rounded-r-md"></div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <i className="ph-fill ph-quotes text-gray-400 text-[12px]"></i>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">Catatan Anda</span>
                  </div>
                  <p className="text-[13px] text-gray-700 leading-relaxed font-medium italic">{v.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-16 pb-10 text-center animate-fadeIn">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <i className="ph-fill ph-bookmark-simple text-3xl"></i>
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Belum ada data</h4>
          <p className="text-xs text-gray-500 max-w-[220px]">
            {viewMode === 'notes' ? 'Anda belum memiliki ayat dengan catatan renungan.' : 'Anda belum memberikan sorotan warna pada ayat mana pun.'}
          </p>
        </div>
      )}
    </div>
  );
}