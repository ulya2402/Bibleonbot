import { useState, useEffect } from 'react';

const API_URL = 'https://main.bibleonbot-webapp.pages.dev/api';

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
      console.error('Fetch Saved Error:', e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, [userId]);

  const removeSavedVerse = async (id: number) => {
    if (!confirm('Hapus ayat ini dari daftar tersimpan?')) return;
    try {
      await fetch(`${API_URL}/saved-verses?id=${id}`, { method: 'DELETE' });
      fetchSaved(); 
    } catch (e) {
      console.error('Delete Saved Error:', e);
    }
  };

  return (
    <div className="animate-fadeIn px-5 pt-5 space-y-6 pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-extrabold text-2xl tracking-tight text-gray-900">Tersimpan</h2>
          <p className="text-[13px] text-gray-500 font-medium mt-1">Koleksi ayat dan catatan Anda.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-900 font-bold text-sm shadow-sm">
          {savedVerses.length}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <i className="ph-bold ph-spinner animate-spin text-3xl text-gray-400"></i>
        </div>
      ) : savedVerses.length > 0 ? (
        <div className="space-y-4">
          {savedVerses.map((v) => (
            <div key={v.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group overflow-hidden">
              
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${v.color === 'Kuning' ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
              
              <div className="flex justify-between items-start mb-3 pl-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-900 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                  {v.book} {v.chapter}:{v.verse}
                </span>
                <button onClick={() => removeSavedVerse(v.id)} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition">
                  <i className="ph-bold ph-trash text-sm"></i>
                </button>
              </div>
              
              <p className="text-[14px] text-gray-800 font-medium leading-relaxed pl-2 mb-3">
                <span className={v.color === 'Kuning' ? 'bg-yellow-100 px-1 rounded' : ''}>{v.content}</span>
              </p>
              
              {v.note && (
                <div className="ml-2 bg-yellow-50 p-3.5 rounded-xl border border-yellow-100">
                  <div className="flex items-center gap-1.5 mb-2 text-yellow-700">
                    <i className="ph-bold ph-pencil-simple text-sm"></i>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Catatan Renungan</span>
                  </div>
                  <p className="text-xs text-yellow-900 font-medium leading-relaxed">{v.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-20 pb-10 text-center opacity-80">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <i className="ph-fill ph-bookmark-simple text-3xl"></i>
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Belum ada ayat</h4>
          <p className="text-xs text-gray-500 max-w-[200px]">Simpan ayat, tambahkan sorotan warna, dan buat catatan renungan Anda.</p>
        </div>
      )}
    </div>
  );
}