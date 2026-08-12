export default function BibleTab({ 
  currentBook, currentChapter, currentVersion,
  setSelectorStep, setIsSelectorOpen,
  isLoadingBible, bibleVerses, savedVerses,
  selectedVerses, handleVerseSelect, handleTouchStart, handleTouchEnd,
  setViewingNote
}: any) {

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

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="flex-none sticky top-0 z-30 bg-[#fafafa]/95 backdrop-blur-md px-5 py-3 border-b border-gray-200 flex gap-2 overflow-x-auto shadow-sm no-scrollbar">
        <button 
          onClick={() => { setSelectorStep('book'); setIsSelectorOpen(true); }}
          className="flex items-center gap-2 px-5 py-2 bg-[#1a1d23] text-white rounded-full shadow-sm text-[13px] font-bold transition active:scale-95"
        >
          <span>{currentBook.name} {currentChapter}</span>
          <i className="ph-bold ph-caret-down text-gray-400"></i>
        </button>
        <button 
          onClick={() => { setSelectorStep('version'); setIsSelectorOpen(true); }}
          className="flex items-center gap-2 px-5 py-2 bg-white text-gray-800 border border-gray-200 rounded-full shadow-sm text-[13px] font-bold transition active:scale-95"
        >
          <span>{currentVersion.id}</span>
          <i className="ph-bold ph-caret-down text-gray-400"></i>
        </button>
      </div>

      <div className="flex-1 px-5 pt-4 pb-10">
        <div className="relative mb-5 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className="ph-bold ph-magnifying-glass text-gray-400 text-lg"></i>
          </div>
          <input type="text" placeholder={`Cari di ${currentBook.name} ${currentChapter}...`} className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-[14px] font-medium text-gray-800 focus:outline-none focus:border-gray-400 transition shadow-sm" />
        </div>

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
          ) : bibleVerses.length > 0 ? (
            bibleVerses.map((verseData: any) => {
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
              <p className="text-sm font-medium text-gray-500">Ayat tidak ditemukan di Database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}