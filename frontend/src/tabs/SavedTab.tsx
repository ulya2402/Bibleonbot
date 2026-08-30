import { useState } from 'react';

const API_URL = 'https://bibleonbot-backend.rchtxtdev.workers.dev/api';

export default function SavedTab({ savedVerses, fetchSaved, onNavigateToVerse }: any) {
  const [viewMode, setViewMode] = useState<'notes' | 'highlights'>('notes');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);

  const COLOR_MAP: Record<string, string> = {
    'yellow': 'bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'green': 'bg-emerald-100 text-emerald-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'blue': 'bg-sky-100 text-sky-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'pink': 'bg-rose-100 text-rose-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'purple': 'bg-purple-100 text-purple-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'orange': 'bg-orange-100 text-orange-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'teal': 'bg-teal-100 text-teal-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
    'indigo': 'bg-indigo-100 text-indigo-950 px-1.5 py-0.5 rounded-md box-decoration-clone',
  };

  const removeSavedVerse = (id: number) => {
    const tg = (window as any).Telegram?.WebApp;
    const executeDelete = async () => {
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

    if (tg && typeof tg.showConfirm === 'function') {
      tg.showConfirm('Hapus ayat ini dari daftar tersimpan?', (confirmed: boolean) => {
        if (confirmed) executeDelete();
      });
    } else {
      if (confirm('Hapus ayat ini dari daftar tersimpan?')) {
        executeDelete();
      }
    }
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

      <div className="flex bg-[#f0f2f5] p-1 rounded-2xl mb-5">
        <button
          onClick={() => setViewMode('notes')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 active:scale-95 ${
            viewMode === 'notes' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          Catatan ({versesWithNotes.length})
        </button>
        <button
          onClick={() => setViewMode('highlights')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all duration-150 active:scale-95 ${
            viewMode === 'highlights' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-400 hover:text-gray-700'
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
                onClick={() => onNavigateToVerse && onNavigateToVerse(v.book, v.chapter, v.verse)}
                className={`bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs hover:border-gray-300 active:scale-[0.985] cursor-pointer transition-all duration-150 select-none group ${
                  deletingId === v.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <div className="flex justify-between items-center mb-2.5">
                  <div className="flex items-center gap-1.5 text-gray-900 group-hover:text-emerald-800 transition-colors">
                    <span className="text-[12.5px] font-extrabold tracking-tight">
                      {v.book} {v.chapter}:{v.verse}
                    </span>
                    <i className="ph-bold ph-caret-right text-xs text-gray-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all"></i>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSavedVerse(v.id);
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 active:scale-80 transition-all duration-150"
                  >
                    <i className="ph-bold ph-trash text-xs"></i>
                  </button>
                </div>

                <p className={`text-[13.5px] leading-relaxed text-gray-700 font-normal ${highlightClass}`}>
                  "{v.content}"
                </p>

                {v.note && (
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-start gap-2">
                    <i className="ph-fill ph-notebook text-gray-400 text-xs mt-0.5 shrink-0"></i>
                    <p className="text-[13px] text-gray-800 leading-relaxed font-normal whitespace-pre-wrap flex-1">
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