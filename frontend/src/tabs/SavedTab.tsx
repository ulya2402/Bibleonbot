import { useState, useEffect } from 'react';

const API_URL = 'https://bibleonbot-backend.rchtxtdev.workers.dev/api';

export default function SavedTab({ userId }: any) {
  const [savedVerses, setSavedVerses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSaved = async () => {
    if (!userId) return setIsLoading(false);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/saved-verses?userId=${userId}`);
      if (res.ok) {
        setSavedVerses(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  // Muat data tiap kali Tab dibuka
  useEffect(() => {
    fetchSaved();
  }, [userId]);

  const removeSavedVerse = async (id: number) => {
    if (!confirm('Hapus ayat ini dari daftar tersimpan?')) return;
    await fetch(`${API_URL}/saved-verses?id=${id}`, { method: 'DELETE' });
    fetchSaved(); // Refresh daftar
  };

  return (
    <div className="animate-fadeIn px-5 pt-5 space-y-6 pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-extrabold text-2xl tracking-tight text-gray-900">Tersimpan</h2>
          <p className="text-[13px] text-gray-500 font-medium mt-1">Koleksi ayat yang Anda warnai.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <i className="ph ph-spinner animate-spin text-3xl text-gray-400"></i>
        </div>
      ) : savedVerses.length > 0 ? (
        <div className="space-y-4">
          {savedVerses.map((v) => (
            <div key={v.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group overflow-hidden">
              {/* Indikator Warna di Samping */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400"></div>
              
              <div className="flex justify-between items-start mb-2 pl-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                  {v.book} {v.chapter}:{v.verse}
                </span>
                <button onClick={() => removeSavedVerse(v.id)} className="text-gray-400 hover:text-red-500 transition">
                  <i className="ph-bold ph-trash"></i>
                </button>
              </div>
              <p className="text-[14px] text-gray-900 font-medium leading-relaxed pl-2">
                <span className="bg-yellow-200/40 rounded px-1">{v.content}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 opacity-60">
          <i className="ph-duotone ph-bookmarks text-5xl text-gray-400 mb-3"></i>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Belum ada ayat</p>
          <p className="text-[11px] mt-2 text-gray-400">Pilih ayat di Tab Alkitab dan klik ikon Warna.</p>
        </div>
      )}
    </div>
  );
}