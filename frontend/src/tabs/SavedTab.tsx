import { useState } from 'react';

const API_URL = 'https://bibleonbot-backend.rchtxtdev.workers.dev/api';

export default function SavedTab({ savedVerses, fetchSaved }: any) {
  const [viewMode, setViewMode] = useState<'notes' | 'highlights'>('notes');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);

  const COLOR_MAP: Record<string, string> = {
    'yellow': 'bg-amber-100/90 text-amber-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'green': 'bg-emerald-100/90 text-emerald-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'blue': 'bg-sky-100/90 text-sky-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'pink': 'bg-rose-100/90 text-rose-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'purple': 'bg-purple-100/90 text-purple-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
  };

  const removeSavedVerse = async (id: number) => {
    if (!confirm('Hapus ayat ini dari daftar tersimpan?')) return;
    
    setDeletingId(id);
    setTimeout(async () => {
      setHiddenIds(prev => [...prev, id]);
      try {
        await fetch(`${API_URL}/saved-verses?id=${id}&t=${Date.now()}`, { method: 'DELETE' });
        fetchSaved();
      } catch (e) {
        console.error('Delete saved verse error:', e);
        setHiddenIds(prev => prev.filter(hid => hid !== id));
      }
      setDeletingId(null);
    }, 250);
  };

  const versesWithNotes = savedVerses
    .filter((v: any) => v.note && v.note.trim() !== '' && !hiddenIds.includes(v.id))
    .sort((a: any, b: any) => b.id - a.id);

  const versesWithHighlights = savedVerses
    .filter((v: any) => (!v.note || v.note.trim() === '') && v.color && !hiddenIds.includes(v.id))
    .sort((a: any, b: any) => b.id - a.id);

  const displayedVerses = viewMode === 'notes' ? versesWithNotes : versesWithHighlights;

  return (
    <div className="animate-fadeIn px-5 pt-4 pb-10">
      <div className="mb-5">
        <h2 className="font-bold text-2xl tracking-tight text-gray-900">Tersimpan</h2>
        <p className="text-[13px] text-gray-400 font-medium mt-0.5">Koleksi ayat dan catatan pribadi Anda</p>
      </div>

      <div className="flex bg-[#f4f5f7] p-1 rounded-2xl mb-6">
        <button
          onClick={() => setViewMode('notes')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 ${
            viewMode === 'notes' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Catatan ({versesWithNotes.length})
        </button>
        <button
          onClick={() => setViewMode('highlights')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all duration-200 ${
            viewMode === 'highlights' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Sorotan ({versesWithHighlights.length})
        </button>
      </div>

      {displayedVerses.length > 0 ? (
        <div className="space-y-3">
          {displayedVerses.map((v: any) => {
            const highlightClass = v.color ? COLOR_MAP[v.color] || '' : '';

            return (
              <div
                key={v.id}
                className={`bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] transition-all duration-200 ${
                  deletingId === v.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11.5px] font-bold uppercase tracking-wider text-gray-400">
                    {v.book} {v.chapter}:{v.verse}
                  </span>
                  <button
                    onClick={() => removeSavedVerse(v.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition"
                  >
                    <i className="ph-bold ph-trash text-xs"></i>
                  </button>
                </div>

                <p className={`text-[14px] leading-relaxed text-gray-700 font-normal my-2 ${highlightClass}`}>
                  "{v.content}"
                </p>

                {v.note && (
                  <div className="mt-3.5 pt-3 bg-[#f8f9fa] rounded-xl p-3.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">
                      Catatan
                    </span>
                    <p className="text-[13.5px] text-gray-800 leading-relaxed font-normal whitespace-pre-wrap">
                      {v.note}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-16 pb-10 text-center animate-fadeIn">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
            <i className="ph-fill ph-bookmark-simple text-xl"></i>
          </div>
          <h4 className="font-bold text-sm text-gray-900 mb-1">Belum ada data</h4>
          <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed">
            {viewMode === 'notes'
              ? 'Pilih ayat di Alkitab dan gunakan tombol Catat untuk menambahkan renungan.'
              : 'Pilih ayat di Alkitab dan terapkan warna sorotan untuk menandai ayat.'}
          </p>
        </div>
      )}
    </div>
  );
}