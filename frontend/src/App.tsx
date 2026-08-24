import { useState, useEffect, useRef } from 'react';
import type { UIEvent } from 'react';
import HomeTab from './tabs/HomeTab';
import BibleTab from './tabs/BibleTab';
import SavedTab from './tabs/SavedTab';
import AdminTab from './tabs/AdminTab';
import { BIBLE_LANGUAGES, ALL_BIBLE_VERSIONS, DEFAULT_BIBLE_VERSION,  } from './types/bible';
import type { BibleVersion } from './types/bible';

const API_URL = 'https://bibleonbot-backend.rchtxtdev.workers.dev/api';
const ADMIN_ID = 513342558;

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
  const [currentVersion, setCurrentVersion] = useState<BibleVersion>(() => {
    const savedVerId = localStorage.getItem('bible_preferred_version');
    const matched = ALL_BIBLE_VERSIONS.find(v => v.id === savedVerId);
    return matched || DEFAULT_BIBLE_VERSION;
  });
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

  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLElement | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const colorHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isColorHeld = useRef(false);

  const handleMainScroll = (e: UIEvent<HTMLElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const scrollDifference = currentScrollY - lastScrollY.current;

    if (currentScrollY <= 30) {
      setIsNavVisible(true);
    } else if (scrollDifference > 10 && currentScrollY > 70) {
      setIsNavVisible(false);
    } else if (scrollDifference < -10) {
      setIsNavVisible(true);
    }
    lastScrollY.current = currentScrollY;
  };

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
    } catch (error) {
      console.error('Fetch Home Data Error:', error);
    }
  };

  const fetchSavedData = async () => {
    try {
      const res = await fetch(`${API_URL}/saved-verses?userId=${userId}&t=${new Date().getTime()}`);
      if (res.ok) setSavedVerses(await res.json());
    } catch (error) {
      console.error('Fetch Saved Data Error:', error);
    }
  };

  useEffect(() => {
    let cleanupInsets: (() => void) | undefined;
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready(); tg.expand();
        try { if (!tg.isVersionAtLeast || tg.isVersionAtLeast('8.0')) { tg.requestFullscreen?.(); tg.disableVerticalSwipes?.(); } } catch (e) {}
        try { tg.setHeaderColor?.('#fafafa'); tg.setBackgroundColor?.('#fafafa'); } catch (e) {}

        const applyInsets = () => {
          const root = document.documentElement.style;
          const safe = tg.safeAreaInset || {};
          const content = tg.contentSafeAreaInset || {};
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
        if (currentUserId) { setUserId(currentUserId); setIsAdmin(Number(currentUserId) === ADMIN_ID); }

        cleanupInsets = () => {
          tg.offEvent?.('safeAreaChanged', applyInsets);
          tg.offEvent?.('contentSafeAreaChanged', applyInsets);
          tg.offEvent?.('viewportChanged', applyInsets);
        };
      }
    } catch (error) {}
    fetchHomeData();
    return cleanupInsets;
  }, []);

  useEffect(() => { fetchSavedData(); }, [userId, activeTab]);

  useEffect(() => {
    if (currentVersion.testamentScope === 'NT' && currentBook.test === 'PL') {
      const defaultNTBook = BIBLE_BOOKS.find(b => b.test === 'PB') || BIBLE_BOOKS[39];
      setCurrentBook(defaultNTBook);
      setCurrentChapter(1);
    }
  }, [currentVersion]);

  useEffect(() => {
    const fetchBibleVerses = async () => {
      setIsLoadingBible(true); setBibleVerses([]); 
      try {
        const resBible = await fetch(`${API_URL}/bible?book=${currentBook.id}&chapter=${currentChapter}&version=${currentVersion.id}`);
        if (resBible.ok) setBibleVerses(await resBible.json());
      } catch (error) {
        console.error('Fetch Bible Verses Error:', error);
      } finally { 
        setIsLoadingBible(false); 
      }
    };
    fetchBibleVerses();
    if (mainRef.current) mainRef.current.scrollTop = 0;
    setIsNavVisible(true);
  }, [currentBook, currentChapter, currentVersion]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.verse-item') && !target.closest('.action-menu') && !target.closest('.modal-container') && selectedVerses.length > 0 && !isNoteModalOpen && !viewingNote) {
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

  const handleTouchEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleColorPressStart = () => {
    isColorHeld.current = false;
    colorHoldTimer.current = setTimeout(() => {
      isColorHeld.current = true;
      setIsColorPaletteOpen(true);
      if (navigator.vibrate) navigator.vibrate(40);
    }, 350);
  };

  const handleColorPressEnd = () => {
    if (colorHoldTimer.current) clearTimeout(colorHoldTimer.current);
  };

  const handleColorClick = () => {
    if (isColorHeld.current) {
      isColorHeld.current = false;
      return;
    }
    saveVerseData(lastColor, null);
  };

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
          content: String(v.content).replace(/^ \s*/, ''),
          color: String(finalColor),
          note: String(finalNote)
        };
        if (existingIndex >= 0) newSavedVerses[existingIndex] = { ...newSavedVerses[existingIndex], ...payload };
        else newSavedVerses.push({ ...payload, id: Date.now() + Math.random() });
        const response = await fetch(`${API_URL}/saved-verses?t=${Date.now()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          triggerAction(`Gagal menghubungi server.`);
          return;
        }
      }

      setSavedVerses(newSavedVerses);
      triggerAction(noteParam !== null ? 'Catatan tersimpan!' : 'Warna diterapkan!');
      setIsNoteModalOpen(false);
      setIsColorPaletteOpen(false);
      setNoteInput('');
      setSelectedVerses([]);
    } catch (e: any) {
      triggerAction("Gagal menyambung ke server.");
    }
  };

  const handleShare = () => {
    const selectedTexts = bibleVerses.filter(v => selectedVerses.includes(v.id)).map(v => `> "${v.content}"\n> — ${currentBook.name} ${currentChapter}:${v.verse} (${currentVersion.shortName})`).join('\n\n');
    const fullText = `${selectedTexts}\n\n📖 @bibleonbot`;
    const tg = (window as any).Telegram?.WebApp;
    const shareUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(fullText)}`;
    if (tg && tg.openTelegramLink) { tg.openTelegramLink(shareUrl); } else { window.open(shareUrl, '_blank'); }
    setSelectedVerses([]); setIsColorPaletteOpen(false);
  };

  const handleCopy = () => {
    const selectedTexts = bibleVerses.filter(v => selectedVerses.includes(v.id)).map(v => `"${v.content}"\n${currentBook.name} ${currentChapter}:${v.verse} (${currentVersion.shortName})`).join('\n\n');
    navigator.clipboard.writeText(`${selectedTexts}\n\n📖 @bibleonbot`);
    triggerAction('Ayat disalin!');
    setSelectedVerses([]); setIsColorPaletteOpen(false);
  };

  const handleSelectVersion = (version: BibleVersion) => {
    setCurrentVersion(version);
    localStorage.setItem('bible_preferred_version', version.id);
    setIsSelectorOpen(false);
  };

  const switchActiveTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedVerses([]);
    setIsNavVisible(true);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const hasSelectedHighlight = selectedVerses.some(id => {
    const bv = bibleVerses.find(v => v.id === id);
    if (!bv) return false;
    return savedVerses.some(sv =>
      String(sv.book) === String(currentBook.name) &&
      String(sv.chapter) === String(currentChapter) &&
      String(sv.verse) === String(bv.verse) &&
      Boolean(sv.color)
    );
  });

  const availableBooks = currentVersion.testamentScope === 'NT'
    ? BIBLE_BOOKS.filter(b => b.test === 'PB')
    : BIBLE_BOOKS;

  const currentBookIndex = availableBooks.findIndex(b => b.id === currentBook.id);
  const canGoPrev = currentChapter > 1 || currentBookIndex > 0;
  const canGoNext = currentChapter < currentBook.chapters || currentBookIndex < availableBooks.length - 1;

  const goToPrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(prev => prev - 1);
    } else if (currentBookIndex > 0) {
      const prevBook = availableBooks[currentBookIndex - 1];
      setCurrentBook(prevBook);
      setCurrentChapter(prevBook.chapters);
    }
  };

  const goToNextChapter = () => {
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter(prev => prev + 1);
    } else if (currentBookIndex < availableBooks.length - 1) {
      const nextBook = availableBooks[currentBookIndex + 1];
      setCurrentBook(nextBook);
      setCurrentChapter(1);
    }
  };

  const filteredBooks = availableBooks.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div id="app-container" className="flex flex-col h-full bg-[#fafafa]">
      {activeTab !== 'bible' && (
        <div 
          className="absolute top-0 left-0 right-0 bg-[#fafafa]/85 backdrop-blur-xl z-[60] pointer-events-none" 
          style={{ height: 'calc(max(var(--tg-safe-top, 0px), env(safe-area-inset-top, 0px)) + 3rem)' }}
        />
      )}

      <main 
        ref={mainRef}
        onScroll={handleMainScroll}
        className="flex-1 scroll-area no-scrollbar relative" 
        style={{ 
          paddingTop: activeTab === 'bible' ? 0 : 'calc(max(var(--tg-safe-top, 0px), env(safe-area-inset-top, 0px)) + 3rem)',
          paddingBottom: 'calc(max(var(--tg-safe-bottom, 0px), env(safe-area-inset-bottom, 0px)) + 7rem)'
        }}
      >
        {activeTab === 'home' && <HomeTab dailyVerse={dailyVerse} communities={communities} channels={channels} news={news} userName={userName} isAdmin={isAdmin} setActiveTab={setActiveTab} />}
        
        {activeTab === 'bible' && (
          <BibleTab
            currentBook={currentBook}
            currentChapter={currentChapter}
            currentVersion={currentVersion}
            setSelectorStep={setSelectorStep}
            setIsSelectorOpen={setIsSelectorOpen}
            isLoadingBible={isLoadingBible}
            bibleVerses={bibleVerses}
            savedVerses={savedVerses}
            selectedVerses={selectedVerses}
            handleVerseSelect={handleVerseSelect}
            handleTouchStart={handleTouchStart}
            handleTouchEnd={handleTouchEnd}
            setViewingNote={setViewingNote}
            goToPrevChapter={goToPrevChapter}
            goToNextChapter={goToNextChapter}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
          />
        )}

        {activeTab === 'saved' && <SavedTab savedVerses={savedVerses} fetchSaved={fetchSavedData} />}
        {activeTab === 'admin' && <AdminTab triggerAction={triggerAction} refreshHomeData={fetchHomeData} news={news} communities={communities} channels={channels} dailyVerse={dailyVerse} setActiveTab={setActiveTab} />}
      </main>

      {isSelectorOpen && (
        <div className="absolute inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-gray-900/60 transition-opacity" onClick={() => setIsSelectorOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-[500px] mx-auto rounded-t-[1.5rem] h-[85vh] flex flex-col shadow-2xl animate-[fadeIn_0.25s_ease-out]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0 bg-white rounded-t-[1.5rem]">
              {selectorStep === 'chapter' ? (
                <button onClick={() => setSelectorStep('book')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition"><i className="ph-bold ph-arrow-left text-xl"></i></button>
              ) : (
                <div className="w-8"></div>
              )}
              <h3 className="font-extrabold text-lg text-gray-900">
                {selectorStep === 'book' ? 'Pilih Kitab' : selectorStep === 'version' ? 'Pilih Terjemahan' : `Pasal ${tempSelectedBook.name}`}
              </h3>
              <button onClick={() => setIsSelectorOpen(false)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition"><i className="ph-bold ph-x text-xl"></i></button>
            </div>

            {selectorStep === 'book' && (
              <div className="px-5 py-3 border-b border-gray-100 shrink-0 bg-white">
                <div className="relative"><i className="ph-bold ph-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i><input type="text" placeholder="Cari kitab (cth: Yohanes)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-50 rounded-xl py-3 pl-10 pr-4 text-[13px] font-medium focus:outline-none focus:ring-1 focus:ring-gray-300 transition" /></div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5 scroll-area no-scrollbar bg-[#fafafa]">
              {selectorStep === 'version' ? (
                <div className="space-y-6">
                  {BIBLE_LANGUAGES.map((group) => (
                    <div key={group.code} className="space-y-2.5">
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">{group.name}</span>
                        <div className="flex-1 h-[1px] bg-gray-200"></div>
                      </div>
                      <div className="space-y-2">
                        {group.versions.map((ver) => {
                          const isSelected = currentVersion.id === ver.id;
                          return (
                            <button
                               key={ver.id}
                               onClick={() => handleSelectVersion(ver)}
                               className={`w-full p-4 rounded-2xl text-left transition border flex justify-between items-center ${isSelected ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-800 border-gray-100 hover:border-gray-300 shadow-sm'}`}
                            >
                              <div className="pr-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-[14px]">{ver.name}</span>
                                  {ver.testamentScope === 'NT' && (
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${isSelected ? 'bg-gray-800 text-yellow-300 border border-gray-700' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>PB</span>
                                  )}
                                </div>
                                {ver.description && (
                                  <p className={`text-[11px] leading-tight ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{ver.description}</p>
                                )}
                              </div>
                              {isSelected && <i className="ph-bold ph-check-circle text-xl text-green-400 shrink-0"></i>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectorStep === 'book' ? (
                <div className="space-y-6">
                  {currentVersion.testamentScope !== 'NT' && filteredBooks.filter(b => b.test === 'PL').length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3 px-1">
                        <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Perjanjian Lama</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {filteredBooks.filter(b => b.test === 'PL').map((book) => (
                          <button
                            key={book.id}
                            onClick={() => { setTempSelectedBook(book); setSelectorStep('chapter'); setSearchQuery(''); }}
                            className={`p-3 rounded-xl text-left font-bold text-[13px] transition border ${currentBook.id === book.id ? 'bg-[#1a1d23] text-white border-[#1a1d23] shadow-md' : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}`}
                          >
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
                          <button
                             key={book.id}
                             onClick={() => { setTempSelectedBook(book); setSelectorStep('chapter'); setSearchQuery(''); }}
                             className={`p-3 rounded-xl text-left font-bold text-[13px] transition border ${currentBook.id === book.id ? 'bg-[#1a1d23] text-white border-[#1a1d23] shadow-md' : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}`}
                          >
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
                    <button
                       key={ch}
                       onClick={() => { setCurrentBook(tempSelectedBook); setCurrentChapter(ch); setIsSelectorOpen(false); }}
                       className={`aspect-square flex items-center justify-center rounded-xl font-bold text-sm transition border ${currentBook.id === tempSelectedBook.id && currentChapter === ch ? 'bg-[#1a1d23] text-white border-[#1a1d23] shadow-md scale-105' : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}`}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="modal-container bg-white w-full max-w-[480px] rounded-t-[1.75rem] sm:rounded-[1.75rem] p-6 shadow-2xl flex flex-col">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden"></div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-[16px] text-gray-900 tracking-tight">Catatan Renungan</h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{currentBook.name} {currentChapter}:{selectedVerses.map(id => bibleVerses.find(v => v.id === id)?.verse).filter(Boolean).join(', ')}</p>
              </div>
              <button onClick={() => setIsNoteModalOpen(false)} className="w-8 h-8 rounded-full bg-[#f4f5f7] flex items-center justify-center text-gray-500 hover:text-gray-900 transition">
                <i className="ph-bold ph-x text-sm"></i>
              </button>
            </div>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full bg-[#f4f5f7] rounded-2xl p-4 text-[13.5px] leading-relaxed text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-[#eaedf2] transition resize-none h-36 mb-5"
              placeholder="Tuliskan renungan atau perenungan pribadi Anda..."
              autoFocus
            />
            <div className="flex gap-2.5">
              <button onClick={() => setIsNoteModalOpen(false)} className="px-5 py-3 bg-[#f4f5f7] text-gray-700 rounded-xl font-bold text-[12px] hover:bg-gray-200 transition">Batal</button>
              <button onClick={() => saveVerseData(null, noteInput)} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-[12px] hover:bg-black transition active:scale-[0.98]">Simpan Catatan</button>
            </div>
          </div>
        </div>
      )}

      {viewingNote && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="modal-container bg-white w-full max-w-[420px] rounded-[1.75rem] p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-3">
              <span className="px-2.5 py-1 bg-[#f4f5f7] rounded-md text-[11px] font-bold uppercase tracking-wider text-gray-700">
                {viewingNote.book} {viewingNote.chapter}:{viewingNote.verse}
              </span>
              <button onClick={() => setViewingNote(null)} className="w-7 h-7 bg-[#f4f5f7] rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition">
                <i className="ph-bold ph-x text-xs"></i>
              </button>
            </div>
            <p className="text-[13px] text-gray-500 italic leading-relaxed pl-3 my-3">
              "{viewingNote.content}"
            </p>
            <div className="my-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1.5">Catatan</span>
              <p className="text-[14px] text-gray-800 leading-relaxed font-normal whitespace-pre-wrap">
                {viewingNote.note}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Catatan (${viewingNote.book} ${viewingNote.chapter}:${viewingNote.verse}):\n"${viewingNote.content}"\n\nRenungan:\n${viewingNote.note}`);
                  triggerAction('Catatan disalin!');
                  setViewingNote(null);
                }}
                className="flex-1 py-2.5 bg-[#f4f5f7] hover:bg-gray-200 text-gray-800 rounded-xl text-[12px] font-bold transition flex items-center justify-center gap-1.5"
              >
                <i className="ph-bold ph-copy text-sm"></i>
                <span>Salin Catatan</span>
              </button>
              <button
                onClick={() => setViewingNote(null)}
                className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-[12px] font-bold transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`action-menu fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[390px] bg-[#181a1f]/95 backdrop-blur-md text-white rounded-2xl shadow-[0_15px_35px_-5px_rgba(0,0,0,0.35)] p-2 z-50 transition-all duration-200 ${
          selectedVerses.length > 0 && !isNoteModalOpen && !viewingNote ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-20 pointer-events-none'
        }`}
        style={{ bottom: 'calc(max(var(--tg-safe-bottom, 0px), env(safe-area-inset-bottom, 0px)) + 1.25rem)' }}
      >
        {!isColorPaletteOpen ? (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1">
              <button
                onClick={handleColorClick}
                onTouchStart={handleColorPressStart}
                onTouchEnd={handleColorPressEnd}
                onMouseDown={handleColorPressStart}
                onMouseUp={handleColorPressEnd}
                onMouseLeave={handleColorPressEnd}
                className="flex flex-col items-center justify-center w-11 h-11 hover:bg-white/10 rounded-xl transition select-none active:scale-95"
              >
                <div className={`w-3.5 h-3.5 rounded-full ring-2 ring-white/20 ${
                  lastColor === 'yellow' ? 'bg-amber-300' :
                  lastColor === 'green' ? 'bg-emerald-300' :
                  lastColor === 'blue' ? 'bg-sky-300' :
                  lastColor === 'pink' ? 'bg-rose-300' : 'bg-purple-300'
                }`} />
                <span className="text-[9px] font-bold tracking-wide mt-1 text-gray-300">Warna</span>
              </button>

              <button
                onClick={() => setIsColorPaletteOpen(true)}
                className="w-4 h-11 flex items-center justify-center text-gray-400 hover:text-white transition"
              >
                <i className="ph-bold ph-caret-right text-[10px]"></i>
              </button>

              {hasSelectedHighlight && (
                <button
                  onClick={() => saveVerseData('', null)}
                  className="flex flex-col items-center justify-center w-11 h-11 hover:bg-white/10 rounded-xl transition text-rose-300 hover:text-rose-200"
                  title="Hapus Warna"
                >
                  <i className="ph-bold ph-paint-brush-broad text-base"></i>
                  <span className="text-[9px] font-bold tracking-wide mt-0.5">Hapus</span>
                </button>
              )}

              <div className="w-px h-5 bg-white/10 mx-0.5"></div>

              <button
                onClick={openNoteModal}
                className="flex flex-col items-center justify-center w-11 h-11 hover:bg-white/10 rounded-xl transition text-gray-300 hover:text-white"
              >
                <i className="ph-bold ph-pencil-simple text-base"></i>
                <span className="text-[9px] font-bold tracking-wide mt-0.5">Catat</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex flex-col items-center justify-center w-11 h-11 hover:bg-white/10 rounded-xl transition text-gray-300 hover:text-white"
              >
                <i className="ph-bold ph-copy text-base"></i>
                <span className="text-[9px] font-bold tracking-wide mt-0.5">Salin</span>
              </button>

              <button
                onClick={handleShare}
                className="flex flex-col items-center justify-center w-11 h-11 hover:bg-white/10 rounded-xl transition text-sky-400 hover:text-sky-300"
              >
                <i className="ph-bold ph-telegram-logo text-base"></i>
                <span className="text-[9px] font-bold tracking-wide mt-0.5">Share</span>
              </button>
            </div>

            <div className="flex items-center">
              <div className="w-px h-5 bg-white/10 mr-1.5"></div>
              <button
                onClick={() => { setSelectedVerses([]); setIsColorPaletteOpen(false); }}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition"
              >
                <i className="ph-bold ph-x text-base"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 py-1 animate-[fadeIn_0.15s_ease-out]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => saveVerseData('', null)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition active:scale-95"
                title="Hapus Warna"
              >
                <i className="ph-bold ph-prohibit text-xs"></i>
              </button>
              <button onClick={() => saveVerseData('yellow', null)} className="w-7 h-7 rounded-full bg-amber-300 transition hover:scale-110 active:scale-95"></button>
              <button onClick={() => saveVerseData('green', null)} className="w-7 h-7 rounded-full bg-emerald-300 transition hover:scale-110 active:scale-95"></button>
              <button onClick={() => saveVerseData('blue', null)} className="w-7 h-7 rounded-full bg-sky-300 transition hover:scale-110 active:scale-95"></button>
              <button onClick={() => saveVerseData('pink', null)} className="w-7 h-7 rounded-full bg-rose-300 transition hover:scale-110 active:scale-95"></button>
              <button onClick={() => saveVerseData('purple', null)} className="w-7 h-7 rounded-full bg-purple-300 transition hover:scale-110 active:scale-95"></button>
            </div>
            <button
              onClick={() => setIsColorPaletteOpen(false)}
              className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-full text-gray-300 hover:text-white transition"
            >
              <i className="ph-bold ph-arrow-left text-xs"></i>
            </button>
          </div>
        )}
      </div>

      <nav className={`absolute left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-[2rem] px-6 py-3.5 flex justify-center gap-8 items-center z-40 w-max shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 ${(selectedVerses.length > 0 || isNoteModalOpen || viewingNote || !isNavVisible) ? 'opacity-0 invisible translate-y-24 pointer-events-none' : 'opacity-100 visible translate-y-0'}`} style={{ bottom: 'calc(max(var(--tg-safe-bottom, 0px), env(safe-area-inset-bottom, 0px)) + 1.5rem)' }}>
        <button onClick={() => switchActiveTab('home')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'home' ? 'text-gray-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}><i className={`${activeTab === 'home' ? 'ph-fill' : 'ph'} ph-house text-2xl`}></i><span className="text-[9px] font-extrabold tracking-wider uppercase">Home</span></button>
        <button onClick={() => switchActiveTab('bible')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'bible' ? 'text-gray-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}><i className={`${activeTab === 'bible' ? 'ph-fill' : 'ph'} ph-book-open-text text-2xl`}></i><span className="text-[9px] font-extrabold tracking-wider uppercase">Alkitab</span></button>
        <button onClick={() => switchActiveTab('saved')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'saved' ? 'text-gray-900 scale-110' : 'text-gray-400 hover:text-gray-600'}`}><i className={`${activeTab === 'saved' ? 'ph-fill' : 'ph'} ph-bookmark-simple text-2xl`}></i><span className="text-[9px] font-extrabold tracking-wider uppercase">Simpan</span></button>
      </nav>

      <div className={`absolute left-1/2 -translate-x-1/2 bg-[#1a1d23] text-white px-6 py-3.5 rounded-full text-[13px] font-bold shadow-2xl transition-all duration-300 z-[150] flex items-center gap-2 border border-gray-800 ${showToast ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`} style={{ top: showToast ? 'calc(max(var(--tg-safe-top, 0px), env(safe-area-inset-top, 0px)) + 1.5rem)' : '-100px' }}>
        <i className="ph-fill ph-check-circle text-green-400 text-lg"></i><span>{toastMsg}</span>
      </div>
    </div>
  );
}