import { useState, useEffect, useRef } from 'react';
import HomeTab from './tabs/HomeTab';
import BibleTab from './tabs/BibleTab';
import SavedTab from './tabs/SavedTab';
import AdminTab from './tabs/AdminTab';

const API_URL = 'https://bibleonbot-backend.rchtxtdev.workers.dev/api';
const ADMIN_ID = 8189771306;

// PERBAIKAN FATAL: Menyamakan singkatan (id) dengan tb.csv agar ayat 100% muncul
const BIBLE_BOOKS = [
  { id: 'Kej', name: 'Kejadian', chapters: 50, test: 'PL' }, { id: 'Kel', name: 'Keluaran', chapters: 40, test: 'PL' },
  { id: 'Ima', name: 'Imamat', chapters: 27, test: 'PL' }, { id: 'Bil', name: 'Bilangan', chapters: 36, test: 'PL' },
  { id: 'Ula', name: 'Ulangan', chapters: 34, test: 'PL' }, { id: 'Yos', name: 'Yosua', chapters: 24, test: 'PL' },
  { id: 'Hak', name: 'Hakim-hakim', chapters: 21, test: 'PL' }, { id: 'Rut', name: 'Rut', chapters: 4, test: 'PL' },
  { id: '1Sa', name: '1 Samuel', chapters: 31, test: 'PL' }, { id: '2Sa', name: '2 Samuel', chapters: 24, test: 'PL' },
  { id: '1Ra', name: '1 Raja-raja', chapters: 22, test: 'PL' }, { id: '2Ra', name: '2 Raja-raja', chapters: 25, test: 'PL' },
  { id: '1Ta', name: '1 Tawarikh', chapters: 29, test: 'PL' }, { id: '2Ta', name: '2 Tawarikh', chapters: 36, test: 'PL' },
  { id: 'Ezr', name: 'Ezra', chapters: 10, test: 'PL' }, { id: 'Neh', name: 'Nehemia', chapters: 13, test: 'PL' },
  { id: 'Est', name: 'Ester', chapters: 10, test: 'PL' }, { id: 'Ayb', name: 'Ayub', chapters: 42, test: 'PL' },
  { id: 'Mzm', name: 'Mazmur', chapters: 150, test: 'PL' }, { id: 'Ams', name: 'Amsal', chapters: 31, test: 'PL' },
  { id: 'Pkh', name: 'Pengkhotbah', chapters: 12, test: 'PL' }, { id: 'Kid', name: 'Kidung Agung', chapters: 8, test: 'PL' },
  { id: 'Yes', name: 'Yesaya', chapters: 66, test: 'PL' }, { id: 'Yer', name: 'Yeremia', chapters: 52, test: 'PL' },
  { id: 'Rat', name: 'Ratapan', chapters: 5, test: 'PL' }, { id: 'Yeh', name: 'Yehezkiel', chapters: 48, test: 'PL' },
  { id: 'Dan', name: 'Daniel', chapters: 12, test: 'PL' }, { id: 'Hos', name: 'Hosea', chapters: 14, test: 'PL' },
  { id: 'Yoe', name: 'Yoel', chapters: 3, test: 'PL' }, { id: 'Amo', name: 'Amos', chapters: 9, test: 'PL' },
  { id: 'Oba', name: 'Obaja', chapters: 1, test: 'PL' }, { id: 'Yun', name: 'Yunus', chapters: 4, test: 'PL' },
  { id: 'Mik', name: 'Mikha', chapters: 7, test: 'PL' }, { id: 'Nah', name: 'Nahum', chapters: 3, test: 'PL' },
  { id: 'Hab', name: 'Habakuk', chapters: 3, test: 'PL' }, { id: 'Zef', name: 'Zefanya', chapters: 3, test: 'PL' },
  { id: 'Hag', name: 'Hagai', chapters: 2, test: 'PL' }, { id: 'Zak', name: 'Zakharia', chapters: 14, test: 'PL' },
  { id: 'Mal', name: 'Maleakhi', chapters: 4, test: 'PL' },
  { id: 'Mat', name: 'Matius', chapters: 28, test: 'PB' }, { id: 'Mrk', name: 'Markus', chapters: 16, test: 'PB' },
  { id: 'Luk', name: 'Lukas', chapters: 24, test: 'PB' }, { id: 'Yoh', name: 'Yohanes', chapters: 21, test: 'PB' },
  { id: 'Kis', name: 'Kisah Para Rasul', chapters: 28, test: 'PB' }, { id: 'Rom', name: 'Roma', chapters: 16, test: 'PB' },
  { id: '1Ko', name: '1 Korintus', chapters: 16, test: 'PB' }, { id: '2Ko', name: '2 Korintus', chapters: 13, test: 'PB' },
  { id: 'Gal', name: 'Galatia', chapters: 6, test: 'PB' }, { id: 'Efe', name: 'Efesus', chapters: 6, test: 'PB' },
  { id: 'Flp', name: 'Filipi', chapters: 4, test: 'PB' }, { id: 'Kol', name: 'Kolose', chapters: 4, test: 'PB' },
  { id: '1Te', name: '1 Tesalonika', chapters: 5, test: 'PB' }, { id: '2Te', name: '2 Tesalonika', chapters: 3, test: 'PB' },
  { id: '1Ti', name: '1 Timotius', chapters: 6, test: 'PB' }, { id: '2Ti', name: '2 Timotius', chapters: 4, test: 'PB' },
  { id: 'Tit', name: 'Titus', chapters: 3, test: 'PB' }, { id: 'Flm', name: 'Filemon', chapters: 1, test: 'PB' },
  { id: 'Ibr', name: 'Ibrani', chapters: 13, test: 'PB' }, { id: 'Yak', name: 'Yakobus', chapters: 5, test: 'PB' },
  { id: '1Pt', name: '1 Petrus', chapters: 5, test: 'PB' }, { id: '2Pt', name: '2 Petrus', chapters: 3, test: 'PB' },
  { id: '1Yo', name: '1 Yohanes', chapters: 5, test: 'PB' }, { id: '2Yo', name: '2 Yohanes', chapters: 1, test: 'PB' },
  { id: '3Yo', name: '3 Yohanes', chapters: 1, test: 'PB' }, { id: 'Yud', name: 'Yudas', chapters: 1, test: 'PB' },
  { id: 'Why', name: 'Wahyu', chapters: 22, test: 'PB' }
];

const BIBLE_VERSIONS = [{ id: 'TB', name: 'Terjemahan Baru (TB)' }];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState(true);
  const [userId, setUserId] = useState<string>(ADMIN_ID.toString());
  const [userName, setUserName] = useState<string>('Pengguna');
  
  const [dailyVerse, setDailyVerse] = useState<any>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [savedVerses, setSavedVerses] = useState<any[]>([]);
  
  const [currentBook, setCurrentBook] = useState(BIBLE_BOOKS[0]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentVersion, setCurrentVersion] = useState(BIBLE_VERSIONS[0]);
  const [bibleVerses, setBibleVerses] = useState<any[]>([]);
  const [isLoadingBible, setIsLoadingBible] = useState(false);

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorStep, setSelectorStep] = useState<'book' | 'chapter' | 'version'>('book');
  const [tempSelectedBook, setTempSelectedBook] = useState(BIBLE_BOOKS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<any>(null);
  
  const [lastColor, setLastColor] = useState(localStorage.getItem('bible_last_color') || 'yellow');

  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchHomeData = async () => {
    try {
      const resHome = await fetch(`${API_URL}/home?t=${new Date().getTime()}`);
      if (resHome.ok) {
        const data = await resHome.json();
        setDailyVerse(data.dailyVerse);
        setCommunities(data.communities || []);
        setChannels(data.channels || []);
        setNews(data.news || []);
      }
    } catch (error) { console.error('API Fetch Error:', error); }
  };

  const fetchSavedData = async () => {
    try {
      const res = await fetch(`${API_URL}/saved-verses?userId=${userId}&t=${new Date().getTime()}`);
      if (res.ok) setSavedVerses(await res.json());
    } catch (error) { console.error('API Fetch Saved Error:', error); }
  };

  useEffect(() => {
    let cleanupInsets: (() => void) | undefined;

    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();

        try {
          if (!tg.isVersionAtLeast || tg.isVersionAtLeast('8.0')) {
            tg.requestFullscreen?.();
            tg.disableVerticalSwipes?.();
          }
        } catch (e) {}

        try {
          tg.setHeaderColor?.('#fafafa');
          tg.setBackgroundColor?.('#fafafa');
        } catch (e) {}

        const applyInsets = () => {
          const root = document.documentElement.style;
          const safe = tg.safeAreaInset || {};
          const content = tg.contentSafeAreaInset || {};
          // Fallback ke 0 jika API Telegram belum termuat agar tidak error CSS
          root.setProperty('--tg-safe-top', `${safe.top || 0}px`);
          root.setProperty('--tg-safe-bottom', `${safe.bottom || 0}px`);
          root.setProperty('--tg-content-top', `${content.top || 0}px`);
          root.setProperty('--tg-content-bottom', `${content.bottom || 0}px`);
        };

        applyInsets();
        tg.onEvent?.('safeAreaChanged', applyInsets);
        tg.onEvent?.('contentSafeAreaChanged', applyInsets);
        tg.onEvent?.('viewportChanged', applyInsets);

        const currentUserId = tg.initDataUnsafe?.user?.id?.toString();
        const firstName = tg.initDataUnsafe?.user?.first_name;

        if (firstName) setUserName(firstName);
        if (currentUserId) {
          setUserId(currentUserId);
          setIsAdmin(Number(currentUserId) === ADMIN_ID);
        }

        cleanupInsets = () => {
          tg.offEvent?.('safeAreaChanged', applyInsets);
          tg.offEvent?.('contentSafeAreaChanged', applyInsets);
          tg.offEvent?.('viewportChanged', applyInsets);
        };
      }
    } catch (error) { console.warn('Not in Telegram environment'); }

    fetchHomeData();

    return cleanupInsets;
  }, []);

  useEffect(() => { fetchSavedData(); }, [userId, activeTab]);

  useEffect(() => {
    const fetchBibleVerses = async () => {
      setIsLoadingBible(true);
      setBibleVerses([]); 
      try {
        const resBible = await fetch(`${API_URL}/bible?book=${currentBook.id}&chapter=${currentChapter}&version=${currentVersion.id}`);
        if (resBible.ok) setBibleVerses(await resBible.json());
      } catch (error) { console.error('API Fetch Error:', error); } 
      finally { setIsLoadingBible(false); }
    };
    fetchBibleVerses();
  }, [currentBook, currentChapter, currentVersion]); 

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.verse-item') && !target.closest('.action-menu') && !target.closest('.note-modal-box') && selectedVerses.length > 0 && !isNoteModalOpen && !viewingNote) {
        setSelectedVerses([]);
        setIsColorPaletteOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedVerses, isNoteModalOpen, viewingNote]);

  const handleVerseSelect = (verseId: number) => {
    setSelectedVerses(prev => prev.includes(verseId) ? prev.filter(id => id !== verseId) : [...prev, verseId]);
    setIsColorPaletteOpen(false);
  };

  const handleTouchStart = (verseId: number) => {
    pressTimer.current = setTimeout(() => {
      handleVerseSelect(verseId);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 400); 
  };

  const handleTouchEnd = () => { if (pressTimer.current) clearTimeout(pressTimer.current); };

  const triggerAction = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const openNoteModal = () => {
    if (selectedVerses.length === 0) return;
    let existingNote = '';
    if (selectedVerses.length === 1) {
      const v = bibleVerses.find(bv => bv.id === selectedVerses[0]);
      if (v) {
        const match = savedVerses.find(sv => String(sv.book) === String(currentBook.name) && String(sv.chapter) === String(currentChapter) && String(sv.verse) === String(v.verse));
        if (match && match.note) existingNote = match.note;
      }
    }
    setNoteInput(existingNote);
    setIsNoteModalOpen(true);
  };

  const saveVerseData = async (colorParam: string | null, noteParam: string | null) => {
    const selectedVerseData = bibleVerses.filter(v => selectedVerses.includes(v.id));
    if (selectedVerseData.length === 0) return;

    if (colorParam) {
      setLastColor(colorParam);
      localStorage.setItem('bible_last_color', colorParam);
    }

    const newSavedVerses = [...savedVerses];

    try {
      for (const v of selectedVerseData) {
        const existingIndex = newSavedVerses.findIndex(sv => String(sv.book) === String(currentBook.name) && String(sv.chapter) === String(currentChapter) && String(sv.verse) === String(v.verse));
        const existing = existingIndex >= 0 ? newSavedVerses[existingIndex] : null;
        
        const finalColor = colorParam !== null ? colorParam : (existing?.color || '');
        const finalNote = noteParam !== null ? noteParam : (existing?.note || '');

        const payload = {
          id: existing?.id, 
          user_id: String(userId),
          book: String(currentBook.name),
          chapter: Number(currentChapter),
          verse: Number(v.verse),
          content: String(v.content),
          color: String(finalColor),
          note: String(finalNote)
        };

        if (existingIndex >= 0) newSavedVerses[existingIndex] = { ...newSavedVerses[existingIndex], ...payload };
        else newSavedVerses.push({ ...payload, id: Date.now() + Math.random() });

        await fetch(`${API_URL}/saved-verses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      setSavedVerses(newSavedVerses);
      triggerAction(noteParam !== null ? 'Catatan tersimpan di Tab Simpan!' : 'Warna berhasil diterapkan!');
      
      setIsNoteModalOpen(false);
      setIsColorPaletteOpen(false);
      setNoteInput('');
      setSelectedVerses([]);
      
      fetchSavedData(); 
    } catch (e: any) {
      triggerAction("Gagal menyambung ke server.");
    }
  };

  const handleShare = () => {
    const selectedTexts = bibleVerses
      .filter(v => selectedVerses.includes(v.id))
      .map(v => `> "${v.content}"\n> — ${currentBook.name} ${currentChapter}:${v.verse}`)
      .join('\n\n');
    const fullText = `${selectedTexts}\n\n📖 @bibleonbot`;
    
    const tg = (window as any).Telegram?.WebApp;
    const shareUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(fullText)}`;
    
    if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(shareUrl);
    } else {
        window.open(shareUrl, '_blank');
    }
    
    setSelectedVerses([]);
    setIsColorPaletteOpen(false);
  };

  const handleCopy = () => {
    const selectedTexts = bibleVerses
      .filter(v => selectedVerses.includes(v.id))
      .map(v => `> "${v.content}"\n> — ${currentBook.name} ${currentChapter}:${v.verse}`)
      .join('\n\n');
    const fullText = `${selectedTexts}\n\n📖 @bibleonbot`;
    navigator.clipboard.writeText(fullText);
    triggerAction('Ayat disalin dengan format Kutipan!');
    setSelectedVerses([]);
    setIsColorPaletteOpen(false);
  };

  const filteredBooks = BIBLE_BOOKS.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div id="app-container" className="flex flex-col h-full bg-[#fafafa]">
      
      {/* Top Background Fix untuk Safe Area agar aman di semua jenis HP */}
      <div
        className="fixed top-0 left-0 right-0 bg-[#fafafa]/85 backdrop-blur-xl z-[60] pointer-events-none"
        style={{ height: 'calc(max(var(--tg-safe-top, 0px), env(safe-area-inset-top, 0px)) + 3rem)' }}
      ></div>

      <main
        className="flex-1 scroll-area no-scrollbar relative pb-32"
        style={{ paddingTop: 'calc(max(var(--tg-safe-top, 0px), env(safe-area-inset-top, 0px)) + 3rem)' }}
      >
        {activeTab === 'home' && <HomeTab dailyVerse={dailyVerse} communities={communities} channels={channels} news={news} userName={userName} isAdmin={isAdmin} setActiveTab={setActiveTab} />}
        {activeTab === 'bible' && (
          <BibleTab 
            currentBook={currentBook} currentChapter={currentChapter} currentVersion={currentVersion}
            setSelectorStep={setSelectorStep} setIsSelectorOpen={setIsSelectorOpen}
            isLoadingBible={isLoadingBible} bibleVerses={bibleVerses} savedVerses={savedVerses}
            selectedVerses={selectedVerses} handleVerseSelect={handleVerseSelect}
            handleTouchStart={handleTouchStart} handleTouchEnd={handleTouchEnd}
            setViewingNote={setViewingNote}
          />
        )}
        {activeTab === 'saved' && <SavedTab savedVerses={savedVerses} fetchSaved={fetchSavedData} />}
        {activeTab === 'admin' && <AdminTab triggerAction={triggerAction} refreshHomeData={fetchHomeData} news={news} communities={communities} channels={channels} dailyVerse={dailyVerse} setActiveTab={setActiveTab} />}
      </main>

      {/* SELECTOR MODAL DENGAN PENCARIAN CERDAS */}
      {isSelectorOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-gray-900/60 transition-opacity" onClick={() => setIsSelectorOpen(false)}></div>
          <div className="relative bg-white w-full max-w-[500px] mx-auto rounded-t-[1.5rem] h-[85vh] flex flex-col shadow-2xl animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0 bg-white rounded-t-[1.5rem]">
              {selectorStep === 'chapter' ? (
                <button onClick={() => setSelectorStep('book')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
                  <i className="ph-bold ph-arrow-left text-xl"></i>
                </button>
              ) : <div className="w-8"></div>}
              <h3 className="font-extrabold text-lg text-gray-900">
                {selectorStep === 'book' ? 'Pilih Kitab' : selectorStep === 'version' ? 'Pilih Terjemahan' : `Pasal ${tempSelectedBook.name}`}
              </h3>
              <button onClick={() => setIsSelectorOpen(false)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
                <i className="ph-bold ph-x text-xl"></i>
              </button>
            </div>

            {selectorStep === 'book' && (
              <div className="px-5 py-3 border-b border-gray-100 shrink-0 bg-white">
                <div className="relative">
                  <i className="ph-bold ph-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input type="text" placeholder="Cari kitab (cth: Yohanes)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 rounded-xl py-3 pl-10 pr-4 text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-gray-300 transition" />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5 scroll-area no-scrollbar bg-[#fafafa]">
              {selectorStep === 'version' ? (
                <div className="space-y-2">
                  {BIBLE_VERSIONS.map((ver) => (
                    <button key={ver.id} onClick={() => { setCurrentVersion(ver); setIsSelectorOpen(false); }} className={`w-full p-4 rounded-xl text-left font-bold text-sm transition border flex justify-between items-center ${currentVersion.id === ver.id ? 'bg-[#1a1d23] text-white border-[#1a1d23] shadow-md' : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}`}>
                      <span>{ver.name}</span>
                      {currentVersion.id === ver.id && <i className="ph-bold ph-check-circle text-lg text-green-400"></i>}
                    </button>
                  ))}
                </div>
              ) : selectorStep === 'book' ? (
                <div className="space-y-6">
                  {filteredBooks.filter(b => b.test === 'PL').length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 pl-1">Perjanjian Lama</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredBooks.filter(b => b.test === 'PL').map((book) => (
                          <button key={book.id} onClick={() => { setTempSelectedBook(book); setSelectorStep('chapter'); setSearchQuery(''); }} className={`p-3 rounded-xl text-left font-bold text-[13px] transition border ${currentBook.id === book.id ? 'bg-[#1a1d23] text-white border-[#1a1d23] shadow-md' : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}`}>
                            {book.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {filteredBooks.filter(b => b.test === 'PB').length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 pl-1">Perjanjian Baru</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredBooks.filter(b => b.test === 'PB').map((book) => (
                          <button key={book.id} onClick={() => { setTempSelectedBook(book); setSelectorStep('chapter'); setSearchQuery(''); }} className={`p-3 rounded-xl text-left font-bold text-[13px] transition border ${currentBook.id === book.id ? 'bg-[#1a1d23] text-white border-[#1a1d23] shadow-md' : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}`}>
                            {book.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {filteredBooks.length === 0 && <p className="text-center text-sm text-gray-400 py-4">Kitab tidak ditemukan.</p>}
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: tempSelectedBook.chapters }, (_, i) => i + 1).map((ch) => (
                    <button key={ch} onClick={() => { setCurrentBook(tempSelectedBook); setCurrentChapter(ch); setIsSelectorOpen(false); }} className={`aspect-square flex items-center justify-center rounded-xl font-bold text-sm transition border ${currentBook.id === tempSelectedBook.id && currentChapter === ch ? 'bg-[#1a1d23] text-white border-[#1a1d23] shadow-md scale-105' : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}`}>
                      {ch}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POPUP TULIS CATATAN */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-gray-900/60 p-0 sm:p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-t-[1.5rem] sm:rounded-[1.5rem] p-6 shadow-2xl note-modal-box">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-extrabold text-lg text-gray-900">Catatan Renungan</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition hover:bg-gray-200">
                <i className="ph-bold ph-x text-sm"></i>
              </button>
            </div>
            <textarea 
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full bg-[#fafafa] border border-gray-200 rounded-2xl p-4 text-[14px] leading-relaxed text-gray-800 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition resize-none h-40 mb-5 shadow-inner" 
              placeholder="Ketik renungan atau pemahaman Anda di sini..."
            ></textarea>
            <div className="flex gap-3">
              <button onClick={() => setIsNoteModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-[13px] hover:bg-gray-200 transition">Batal</button>
              <button onClick={() => saveVerseData(null, noteInput)} className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-[13px] hover:bg-gray-800 transition">Simpan Catatan</button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP BACA CATATAN */}
      {viewingNote && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-gray-900/60 p-5 animate-[fadeIn_0.2s_ease-out] note-modal-box">
          <div className="bg-white w-full max-w-[400px] rounded-[1.5rem] p-6 shadow-2xl relative">
            <button onClick={() => setViewingNote(null)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition">
              <i className="ph-bold ph-x text-sm"></i>
            </button>
            <div className="flex items-center gap-2 mb-4 text-gray-400">
              <i className="ph-fill ph-notebook text-xl"></i>
              <span className="text-[10px] font-extrabold uppercase tracking-widest">{viewingNote.book} {viewingNote.chapter}:{viewingNote.verse}</span>
            </div>
            <p className="text-[14px] text-gray-800 font-medium leading-relaxed mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              "{viewingNote.content}"
            </p>
            <div className="border-l-[3px] border-gray-900 pl-4 py-1">
              <p className="text-[14px] text-gray-900 leading-relaxed font-semibold italic">
                {viewingNote.note}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ACTION MENU (MUNCUL JIKA ADA AYAT YANG DIPILIH) */}
      <div 
        className={`action-menu fixed left-5 right-5 max-w-[400px] mx-auto bg-gray-900 text-white rounded-[1.25rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] p-2 flex justify-between items-center z-50 border border-gray-700 transition-all duration-300 ${selectedVerses.length > 0 && !isNoteModalOpen && !viewingNote ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-24 pointer-events-none'}`}
        style={{ bottom: 'calc(max(var(--tg-safe-bottom, 0px), env(safe-area-inset-bottom, 0px)) + 1.5rem)' }}
      >
        {!isColorPaletteOpen ? (
          <div className="flex gap-1 w-full justify-between pr-2">
            <div className="flex gap-1">
              <button onClick={() => saveVerseData(lastColor, null)} className="flex flex-col items-center justify-center gap-1 w-12 h-12 hover:bg-gray-800 rounded-xl transition">
                <div className={`w-4 h-4 rounded-full shadow-inner ${lastColor === 'yellow' ? 'bg-[#fef08a]' : lastColor === 'green' ? 'bg-[#bbf7d0]' : lastColor === 'blue' ? 'bg-[#bfdbfe]' : lastColor === 'pink' ? 'bg-[#fbcfe8]' : 'bg-[#e9d5ff]'}`}></div>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Warna</span>
              </button>
              <button onClick={() => setIsColorPaletteOpen(true)} className="flex items-center justify-center w-6 h-12 hover:bg-gray-800 rounded-xl transition text-gray-400">
                <i className="ph-bold ph-caret-right text-[12px]"></i>
              </button>
              
              <div className="w-px h-6 bg-gray-700 mx-0.5 mt-3"></div>

              <button onClick={handleShare} className="flex flex-col items-center justify-center gap-1 w-12 h-12 hover:bg-gray-800 rounded-xl transition text-blue-400">
                <i className="ph-bold ph-telegram-logo text-[18px]"></i>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Share</span>
              </button>
              <button onClick={handleCopy} className="flex flex-col items-center justify-center gap-1 w-12 h-12 hover:bg-gray-800 rounded-xl transition text-gray-300">
                <i className="ph-bold ph-copy text-[18px]"></i>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Salin</span>
              </button>
              <button onClick={openNoteModal} className="flex flex-col items-center justify-center gap-1 w-12 h-12 hover:bg-gray-800 rounded-xl transition text-gray-300">
                <i className="ph-bold ph-pencil-simple text-[18px]"></i>
                <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Catat</span>
              </button>
            </div>
            <div className="flex items-center">
              <div className="w-px h-8 bg-gray-700 mx-2"></div>
              <button onClick={() => { setSelectedVerses([]); setIsColorPaletteOpen(false); }} className="w-10 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition text-gray-400">
                <i className="ph-bold ph-x text-xl"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 w-full justify-between items-center px-2 py-1 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex gap-3">
              <button onClick={() => saveVerseData('', null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 transition hover:scale-110"><i className="ph-bold ph-x text-sm"></i></button>
              <button onClick={() => saveVerseData('yellow', null)} className="w-8 h-8 rounded-full bg-[#fef08a] shadow-[0_0_0_2px_#1f2937,0_0_0_4px_#fef08a] transition hover:scale-110"></button>
              <button onClick={() => saveVerseData('green', null)} className="w-8 h-8 rounded-full bg-[#bbf7d0] hover:scale-110 transition"></button>
              <button onClick={() => saveVerseData('blue', null)} className="w-8 h-8 rounded-full bg-[#bfdbfe] hover:scale-110 transition"></button>
              <button onClick={() => saveVerseData('pink', null)} className="w-8 h-8 rounded-full bg-[#fbcfe8] hover:scale-110 transition"></button>
              <button onClick={() => saveVerseData('purple', null)} className="w-8 h-8 rounded-full bg-[#e9d5ff] hover:scale-110 transition"></button>
            </div>
            <button onClick={() => setIsColorPaletteOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full transition text-gray-300 hover:text-white">
              <i className="ph-bold ph-arrow-u-up-left text-lg"></i>
            </button>
          </div>
        )}
      </div>

      {/* NAVBAR BAWAH */}
      <nav 
        className={`fixed left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-[2rem] px-6 py-3.5 flex justify-center gap-8 items-center z-40 w-max shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 ${(selectedVerses.length > 0 || isNoteModalOpen || viewingNote) ? 'opacity-0 invisible translate-y-24 pointer-events-none' : 'opacity-100 visible translate-y-0'}`}
        style={{ bottom: 'calc(max(var(--tg-safe-bottom, 0px), env(safe-area-inset-bottom, 0px)) + 1.5rem)' }}
      >
        <button onClick={() => { setActiveTab('home'); setSelectedVerses([]); }} className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? 'text-gray-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
          <i className={`${activeTab === 'home' ? 'ph-fill' : 'ph'} ph-house text-2xl`}></i>
          <span className="text-[9px] font-extrabold tracking-wider uppercase">Home</span>
        </button>
        <button onClick={() => { setActiveTab('bible'); setSelectedVerses([]); }} className={`flex flex-col items-center gap-1 transition ${activeTab === 'bible' ? 'text-gray-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
          <i className={`${activeTab === 'bible' ? 'ph-fill' : 'ph'} ph-book-open-text text-2xl`}></i>
          <span className="text-[9px] font-extrabold tracking-wider uppercase">Alkitab</span>
        </button>
        <button onClick={() => { setActiveTab('saved'); setSelectedVerses([]); }} className={`flex flex-col items-center gap-1 transition ${activeTab === 'saved' ? 'text-gray-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
          <i className={`${activeTab === 'saved' ? 'ph-fill' : 'ph'} ph-bookmark-simple text-2xl`}></i>
          <span className="text-[9px] font-extrabold tracking-wider uppercase">Simpan</span>
        </button>
      </nav>

      {/* TOAST NOTIFIKASI */}
      <div 
        className={`fixed left-1/2 -translate-x-1/2 bg-[#1a1d23] text-white px-6 py-3.5 rounded-full text-[13px] font-bold shadow-2xl transition-all duration-300 z-[150] flex items-center gap-2 border border-gray-800 ${showToast ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ top: showToast ? 'calc(max(var(--tg-safe-top, 0px), env(safe-area-inset-top, 0px)) + 1.5rem)' : '-100px' }}
      >
        <i className="ph-fill ph-check-circle text-green-400 text-lg"></i>
        <span>{toastMsg}</span>
      </div>
    </div>
  );
}