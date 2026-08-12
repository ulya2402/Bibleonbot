import { useState } from 'react';

export default function BibleTab({ 
  currentBook, currentChapter,
  setSelectorStep, setIsSelectorOpen,
  isLoadingBible, bibleVerses, savedVerses,
  selectedVerses, handleVerseSelect, handleTouchStart, handleTouchEnd,
  setViewingNote
}: any) {

  const [verseSearch, setVerseSearch] = useState('');

  const COLOR_MAP: any = {
    'yellow': 'bg-[#fef08a]/60 text-yellow-900 rounded-md px-1',
    'green': 'bg-[#bbf7d0]/60 text-green-900 rounded-md px-1',
    'blue': 'bg-[#bfdbfe]/60 text-blue-900 rounded-md px-1',
    'pink': 'bg-[#fbcfe8]/60 text-pink-900 rounded-md px-1',
    'purple': 'bg-[#e9d5ff]/60 text-purple-900 rounded-md px-1',
  };

  const renderVerseContent = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]|\([^\)]+\))/g);
    return parts.map((part: string, index: number) => {
      if (part.startsWith('[') || part.startsWith('(')) {
        return (
          <span key={index} className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md mx-1 align-middle opacity-90">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const filteredVerses = bibleVerses.filter((v: any) => v.content.toLowerCase().includes(verseSearch.toLowerCase()) || String(v.verse) === verseSearch);

  return (
    <div className="animate-fadeIn h-full flex flex-col pt-2">
      <div className="flex-none px-5 pb-4 flex justify-between items-center gap-2">
        <button 
          onClick={() => { setSelectorStep('book'); setIsSelectorOpen(true); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full shadow-sm text-[13px] font-bold transition active:scale-95"
        >
          <span>{currentBook.name} {currentChapter}</span>
          <i className="ph-bold ph-caret-down text-gray-400"></i>
        </button>
        <div className="relative flex-1">
          <i className="ph-bold ph-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Cari ayat..." 
            value={verseSearch}
            onChange={(e) => setVerseSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-9 pr-4 text-[13px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 transition shadow-sm" 
          />
        </div>
      </div>

      <div className="flex-1 px-5 pb-10">
        <div className="space-y-1">
          {isLoadingBible ? (
            <div className="animate-pulse space-y-5 py-2 mt-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex gap-3 px-3">
                  <div className="w-5 h-4 bg-gray-200 rounded-md shrink-0 mt-1"></div>
                  <div className="flex-1 space-y-2.5">
                    <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVerses.length > 0 ? (
            filteredVerses.map((verseData: any) => {
              const savedMatch = savedVerses.find((sv: any) => String(sv.book) === String(currentBook.name) && String(sv.chapter) === String(currentChapter) && String(sv.verse) === String(verseData.verse));
              const highlightClass = savedMatch && savedMatch.color ? COLOR_MAP[savedMatch.color] : '';
              const hasNote = savedMatch && savedMatch.note && savedMatch.note.trim() !== '';

              return (
                <div 
                  key={verseData.id}
                  onClick={() => handleVerseSelect(verseData.id)}
                  onTouchStart={() => handleTouchStart(verseData.id)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchEnd}
                  className={`verse-item p-3 rounded-xl cursor-pointer flex gap-3 transition-all ${selectedVerses.includes(verseData.id) ? 'bg-[#eceef2] scale-[0.98]' : 'bg-transparent hover:bg-white'}`}
                >
                  <div className="flex flex-col items-center gap-1.5 shrink-0 w-7 pt-[3px]">
                    <span className={`text-[12px] font-extrabold ${selectedVerses.includes(verseData.id) ? 'text-gray-900' : 'text-gray-400'}`}>
                      {verseData.verse}
                    </span>
                    {hasNote && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setViewingNote({ book: currentBook.name, chapter: currentChapter, verse: verseData.verse, content: verseData.content, note: savedMatch.note }); 
                        }}
                        className="w-6 h-6 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 transition shadow-sm border border-yellow-200"
                      >
                        <i className="ph-fill ph-notebook text-[12px]"></i>
                      </button>
                    )}
                  </div>
                  <span className={`text-[15px] leading-relaxed font-medium flex-1 ${selectedVerses.includes(verseData.id) ? 'text-gray-900' : 'text-gray-800'} ${highlightClass}`}>
                    {renderVerseContent(verseData.content)}
                  </span>
                </div>
              )
            })
          ) : (
            <div className="text-center py-10">
              <i className="ph-duotone ph-warning-circle text-4xl text-gray-300 mb-3"></i>
              <p className="text-sm font-medium text-gray-500">Ayat tidak ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}