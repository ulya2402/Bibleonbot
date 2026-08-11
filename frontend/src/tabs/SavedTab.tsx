import { useState, useEffect } from 'react';

const API_URL = 'https://main.bibleonbot-webapp.pages.dev/api';

export default function SavedTab({ userId, savedVerses, fetchSaved }: any) {
  
  const COLOR_BORDER_MAP: any = {
    'yellow': 'bg-yellow-400',
    'green': 'bg-green-400',
    'blue': 'bg-blue-400',
    'pink': 'bg-pink-400',
    'purple': 'bg-purple-400',
    '': 'bg-gray-200'
  };

  const COLOR_TEXT_MAP: any = {
    'yellow': 'bg-[#fef08a]/50 text-yellow-900 rounded-md px-1',
    'green': 'bg-[#bbf7d0]/50 text-green-900 rounded-md px-1',
    'blue': 'bg-[#bfdbfe]/50 text-blue-900 rounded-md px-1',
    'pink': 'bg-[#fbcfe8]/50 text-pink-900 rounded-md px-1',
    'purple': 'bg-[#e9d5ff]/50 text-purple-900 rounded-md px-1',
    '': 'text-gray-800'
  };

  const removeSavedVerse = async (id: number) => {
    if (!confirm('Hapus ayat ini dari daftar tersimpan?')) return;
    try {
      await fetch(`${API_URL}/saved-verses?id=${id}`, { method: 'DELETE' });
      fetchSaved(); 
    } catch (e) {
      console.error(e);
    }
  };

  const groupedVerses = savedVerses.reduce((acc: any, curr: any) => {
    const key = `${curr.book} ${curr.chapter}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <div className="animate-fadeIn px-5 pt-5 space-y-6 pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-extrabold text-2xl tracking-tight text-gray-900">Tersimpan</h2>
          <p className="text-[13px] text-gray-500 font-medium mt-1">Koleksi sorotan & renungan.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-900 font-extrabold text-sm shadow-sm">
          {savedVerses.length}
        </div>
      </div>

      {savedVerses.length > 0 ? (
        <div className="space-y-6">
          {Object.keys(groupedVerses).map((groupKey) => (
            <div key={groupKey} className="space-y-3">
              <h3 className="font-extrabold text-[13px] uppercase tracking-widest text-gray-400 pl-1">{groupKey}</h3>
              <div className="space-y-3">
                {groupedVerses[groupKey].sort((a:any, b:any) => a.verse - b.verse).map((v: any) => (
                  <div key={v.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${COLOR_BORDER_MAP[v.color] || COLOR_BORDER_MAP['']}`}></div>
                    
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <span className="text-[12px] font-extrabold text-gray-900">Ayat {v.verse}</span>
                      <button onClick={() => removeSavedVerse(v.id)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                        <i className="ph-bold ph-trash text-sm"></i>
                      </button>
                    </div>
                    
                    <p className={`text-[14px] font-medium leading-relaxed pl-2 mb-3 ${COLOR_TEXT_MAP[v.color] || COLOR_TEXT_MAP['']}`}>
                      {v.content}
                    </p>
                    
                    {v.note && (
                      <div className="ml-2 mt-3 pl-3 border-l-2 border-gray-200">
                        <div className="flex items-center gap-1.5 mb-1.5 text-gray-400">
                          <i className="ph-bold ph-pencil-simple text-[11px]"></i>
                          <span className="text-[9px] font-extrabold uppercase tracking-widest">Catatan</span>
                        </div>
                        <p className="text-[13px] text-gray-600 font-medium leading-relaxed italic">{v.note}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-24 pb-10 text-center opacity-80">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <i className="ph-fill ph-bookmark-simple text-3xl"></i>
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Belum ada ayat tersimpan</h4>
          <p className="text-xs text-gray-500 max-w-[220px]">Berikan warna pada ayat atau tulis catatan renungan Anda di Tab Alkitab.</p>
        </div>
      )}
    </div>
  );
}