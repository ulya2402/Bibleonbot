import { useState, useEffect, useRef } from 'react';
import HomeTab from './tabs/HomeTab';
import BibleTab from './tabs/BibleTab';
import SavedTab from './tabs/SavedTab';
import AdminTab from './tabs/AdminTab';

const API_URL = 'https://bibleonbot-backend.rchtxtdev.workers.dev/api';

const ADMIN_ID = 8189771306;

const BIBLE_BOOKS = [
  { id: 'Kej', name: 'Kejadian', chapters: 50, test: 'PL' }, { id: 'Kel', name: 'Keluaran', chapters: 40, test: 'PL' },
  { id: 'Im', name: 'Imamat', chapters: 27, test: 'PL' }, { id: 'Bil', name: 'Bilangan', chapters: 36, test: 'PL' },
  { id: 'Ul', name: 'Ulangan', chapters: 34, test: 'PL' }, { id: 'Yos', name: 'Yosua', chapters: 24, test: 'PL' },
  { id: 'Hak', name: 'Hakim-hakim', chapters: 21, test: 'PL' }, { id: 'Rut', name: 'Rut', chapters: 4, test: 'PL' },
  { id: '1Sam', name: '1 Samuel', chapters: 31, test: 'PL' }, { id: '2Sam', name: '2 Samuel', chapters: 24, test: 'PL' },
  { id: '1Raj', name: '1 Raja-raja', chapters: 22, test: 'PL' }, { id: '2Raj', name: '2 Raja-raja', chapters: 25, test: 'PL' },
  { id: '1Taw', name: '1 Tawarikh', chapters: 29, test: 'PL' }, { id: '2Taw', name: '2 Tawarikh', chapters: 36, test: 'PL' },
  { id: 'Ezr', name: 'Ezra', chapters: 10, test: 'PL' }, { id: 'Neh', name: 'Nehemia', chapters: 13, test: 'PL' },
  { id: 'Est', name: 'Ester', chapters: 10, test: 'PL' }, { id: 'Ayb', name: 'Ayub', chapters: 42, test: 'PL' },
  { id: 'Mzm', name: 'Mazmur', chapters: 150, test: 'PL' }, { id: 'Ams', name: 'Amsal', chapters: 31, test: 'PL' },
  { id: 'Pkh', name: 'Pengkhotbah', chapters: 12, test: 'PL' }, { id: 'Kid', name: 'Kidung Agung', chapters: 8, test: 'PL' },
  { id: 'Yes', name: 'Yesaya', chapters: 66, test: 'PL' }, { id: 'Yer', name: 'Yeremia', chapters: 52, test: 'PL' },
  { id: 'Rat', name: 'Ratapan', chapters: 5, test: 'PL' }, { id: 'Yeh', name: 'Yehezkiel', chapters: 48, test: 'PL' },
  { id: 'Dan', name: 'Daniel', chapters: 12, test: 'PL' }, { id: 'Hos', name: 'Hosea', chapters: 14, test: 'PL' },
  { id: 'Yoel', name: 'Yoel', chapters: 3, test: 'PL' }, { id: 'Am', name: 'Amos', chapters: 9, test: 'PL' },
  { id: 'Ob', name: 'Obaja', chapters: 1, test: 'PL' }, { id: 'Yun', name: 'Yunus', chapters: 4, test: 'PL' },
  { id: 'Mik', name: 'Mikha', chapters: 7, test: 'PL' }, { id: 'Nah', name: 'Nahum', chapters: 3, test: 'PL' },
  { id: 'Hab', name: 'Habakuk', chapters: 3, test: 'PL' }, { id: 'Zef', name: 'Zefanya', chapters: 3, test: 'PL' },
  { id: 'Hag', name: 'Hagai', chapters: 2, test: 'PL' }, { id: 'Za', name: 'Zakharia', chapters: 14, test: 'PL' },
  { id: 'Mal', name: 'Maleakhi', chapters: 4, test: 'PL' },
  { id: 'Mat', name: 'Matius', chapters: 28, test: 'PB' }, { id: 'Mrk', name: 'Markus', chapters: 16, test: 'PB' },
  { id: 'Luk', name: 'Lukas', chapters: 24, test: 'PB' }, { id: 'Yoh', name: 'Yohanes', chapters: 21, test: 'PB' },
  { id: 'Kis', name: 'Kisah Para Rasul', chapters: 28, test: 'PB' }, { id: 'Rm', name: 'Roma', chapters: 16, test: 'PB' },
  { id: '1Kor', name: '1 Korintus', chapters: 16, test: 'PB' }, { id: '2Kor', name: '2 Korintus', chapters: 13, test: 'PB' },
  { id: 'Gal', name: 'Galatia', chapters: 6, test: 'PB' }, { id: 'Ef', name: 'Efesus', chapters: 6, test: 'PB' },
  { id: 'Flp', name: 'Filipi', chapters: 4, test: 'PB' }, { id: 'Kol', name: 'Kolose', chapters: 4, test: 'PB' },
  { id: '1Tes', name: '1 Tesalonika', chapters: 5, test: 'PB' }, { id: '2Tes', name: '2 Tesalonika', chapters: 3, test: 'PB' },
  { id: '1Tim', name: '1 Timotius', chapters: 6, test: 'PB' }, { id: '2Tim', name: '2 Timotius', chapters: 4, test: 'PB' },
  { id: 'Tit', name: 'Titus', chapters: 3, test: 'PB' }, { id: 'Flm', name: 'Filemon', chapters: 1, test: 'PB' },
  { id: 'Ibr', name: 'Ibrani', chapters: 13, test: 'PB' }, { id: 'Yak', name: 'Yakobus', chapters: 5, test: 'PB' },
  { id: '1Ptr', name: '1 Petrus', chapters: 5, test: 'PB' }, { id: '2Ptr', name: '2 Petrus', chapters: 3, test: 'PB' },
  { id: '1Yoh', name: '1 Yohanes', chapters: 5, test: 'PB' }, { id: '2Yoh', name: '2 Yohanes', chapters: 1, test: 'PB' },
  { id: '3Yoh', name: '3 Yohanes', chapters: 1, test: 'PB' }, { id: 'Yud', name: 'Yudas', chapters: 1, test: 'PB' },
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
  
  const [dailyVerse, setDailyVerse] = useState<any>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  
  const [currentBook, setCurrentBook] = useState(BIBLE_BOOKS[0]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentVersion, setCurrentVersion] = useState(BIBLE_VERSIONS[0]);
  const [bibleVerses, setBibleVerses] = useState<any[]>([]);
  const [isLoadingBible, setIsLoadingBible] = useState(false);

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorStep, setSelectorStep] = useState<'book' | 'chapter' | 'version'>('book');
  const [tempSelectedBook, setTempSelectedBook] = useState(BIBLE_BOOKS[0]);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteInput, setNoteInput] = useState('');

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
    } catch (error) { 
      console.error('API Fetch Error:', error); 
    }
  };

  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) { 
        tg.ready(); 
        tg.expand(); 
        const currentUserId = tg.initDataUnsafe?.user?.id?.toString();
        if (currentUserId) {
           setUserId(currentUserId);
           setIsAdmin(Number(currentUserId) === ADMIN_ID);
        }
      }
    } catch (error) { 
      console.warn('Not in Telegram environment'); 
    }
    fetchHomeData();
  }, []);

  useEffect(() => {
    const fetchBibleVerses = async () => {
      setIsLoadingBible(true);
      setBibleVerses([]); 
      try {
        const resBible = await fetch(`${API_URL}/bible?book=${currentBook.id}&chapter=${currentChapter}&version=${currentVersion.id}`);
        if (resBible.ok) {
          const bibleData = await resBible.json();
          setBibleVerses(bibleData);
        }
      } catch (error) { 
        console.error('API Fetch Error:', error); 
      } 
      finally { 
        setIsLoadingBible(false); 
      }
    };
    fetchBibleVerses();
  }, [currentBook, currentChapter, currentVersion]); 

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.verse-item') && !target.closest('.action-menu') && !target.closest('.note-modal-box') && selectedVerses.length > 0 && !isNoteModalOpen) {
        setSelectedVerses([]);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedVerses, isNoteModalOpen]);

  const handleVerseSelect = (verseId: number) => {
    setSelectedVerses(prev => prev.includes(verseId) ? prev.filter(id => id !== verseId) : [...prev, verseId]);
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

  const triggerAction = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const openNoteModal = () => {
    if (selectedVerses.length === 0) return;
    setIsNoteModalOpen(true);
  };

  const saveVerseData = async (colorParam: string, noteParam: string) => {
    const selectedVerseData = bibleVerses.filter(v => selectedVerses.includes(v.id));
    if (selectedVerseData.length === 0) {
      alert("Tidak ada ayat yang dipilih!");
      return;
    }

    try {
      for (const v of selectedVerseData) {
        const res = await fetch(`${API_URL}/saved-verses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            book: currentBook.name,
            chapter: currentChapter,
            verse: v.verse,
            content: v.content,
            color: colorParam,
            note: noteParam
          })
        });
        
        if (!res.ok) {
           const errorData = await res.json().catch(() => ({error: 'Not Found'}));
           alert("GAGAL MENYIMPAN! Error Server: " + errorData.error);
           return; 
        }
      }
      
      setActiveTab('saved'); 
      triggerAction(noteParam ? 'Catatan disimpan!' : `Ayat ditandai warna!`);
      setIsNoteModalOpen(false);
      setNoteInput('');
      setSelectedVerses([]);
    } catch (e: any) {
      alert("Gagal koneksi ke server Cloudflare. Pastikan internet menyala.");
    }
  };

  const handleCopy = () => {
    const selectedTexts = bibleVerses
      .filter(v => selectedVerses.includes(v.id))
      .map(v => `${v.verse}. ${v.content}`)
      .join('\n');
    const fullText = `${selectedTexts}\n(${currentBook.name} ${currentChapter}) - Alkitab ID`;
    navigator.clipboard.writeText(fullText);
    triggerAction('Ayat disalin ke Papan Klip!');
    setSelectedVerses([]);
  };

  return (
    <div id="app-container" className="flex flex-col h-full bg-[#fafafa]">
      
      <header className="flex-none px-5 pt-6 pb-4 bg-white z-40 border-b border-gray-100 flex justify-between items-center shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <img src="https://i.ibb.co/0VytPmL7/31399-removebg-preview.png" alt="Logo" className="w-8 h-8 object-contain" />
          <h1 className="font-extrabold text-lg tracking-tight text-gray-900">Alkitab ID</h1>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <button onClick={() => { setActiveTab('admin'); setSelectedVerses([]); }} className={`p-2 rounded-full transition ${activeTab === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
              <i className="ph-bold ph-shield-star text-lg"></i>
            </button>
          )}
          <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition text-gray-600">
            <i className="ph-bold ph-bell text-lg"></i>
          </button>
        </div>
      </header>

      <main className="flex-1 scroll-area no-scrollbar relative pb-32">
        {activeTab === 'home' && <HomeTab dailyVerse={dailyVerse} communities={communities} channels={channels} news={news} />}
        {activeTab === 'bible' && (
          <BibleTab 
            currentBook={currentBook} currentChapter={currentChapter} currentVersion={currentVersion}
            setSelectorStep={setSelectorStep} setIsSelectorOpen={setIsSelectorOpen}
            isLoadingBible={isLoadingBible} bibleVerses={bibleVerses}
            selectedVerses={selectedVerses} handleVerseSelect={handleVerseSelect}
            handleTouchStart={handleTouchStart} handleTouchEnd={handleTouchEnd}
          />
        )}
        {activeTab === 'saved' && <SavedTab userId={userId} />}
        
        {activeTab === 'admin' && (
          <AdminTab triggerAction={triggerAction} refreshHomeData={fetchHomeData} news={news} communities={communities} channels={channels} dailyVerse={dailyVerse} />
        )}
      </main>

      {isSelectorOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-gray-900/70 transition-opacity" onClick={() => setIsSelectorOpen(false)}></div>
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
                  <div>
                    <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 pl-1">Perjanjian Lama</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {BIBLE_BOOKS.filter(b => b.test === 'PL').map((book) => (
                        <button key={book.id} onClick={() => { setTempSelectedBook(book); setSelectorStep('chapter'); }} className={`p-3 rounded-xl text-left font-bold text-[13px] transition border ${currentBook.id === book.id ? 'bg-[#1a1d23] text-white border-[#1a1d23] shadow-md' : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}`}>
                          {book.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 pl-1">Perjanjian Baru</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {BIBLE_BOOKS.filter(b => b.test === 'PB').map((book) => (
                        <button key={book.id} onClick={() => { setTempSelectedBook(book); setSelectorStep('chapter'); }} className={`p-3 rounded-xl text-left font-bold text-[13px] transition border ${currentBook.id === book.id ? 'bg-[#1a1d23] text-white border-[#1a1d23] shadow-md' : 'bg-white text-gray-700 border-gray-100 hover:border-gray-300'}`}>
                          {book.name}
                        </button>
                      ))}
                    </div>
                  </div>
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

      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white w-full max-w-[500px] rounded-t-[1.5rem] p-6 shadow-2xl note-modal-box">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-lg text-gray-900">Tambahkan Catatan</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition hover:bg-gray-200">
                <i className="ph-bold ph-x text-sm"></i>
              </button>
            </div>
            <textarea 
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[13px] focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition resize-none h-32 mb-4" 
              placeholder="Tulis renungan atau catatan Anda di sini..."
            ></textarea>
            <button onClick={() => saveVerseData('', noteInput)} className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition">Simpan Catatan</button>
          </div>
        </div>
      )}

      <div className={`action-menu fixed left-5 right-5 max-w-[400px] mx-auto bg-gray-900 text-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] p-2 flex justify-between items-center z-50 border border-gray-700 transition-all duration-300 ${selectedVerses.length > 0 && !isNoteModalOpen ? 'bottom-8 opacity-100 visible translate-y-0' : 'bottom-0 opacity-0 invisible translate-y-10'}`}>
        <div className="flex gap-1">
          <button onClick={() => saveVerseData('Kuning', '')} className="flex flex-col items-center justify-center gap-1 w-14 h-12 hover:bg-gray-800 rounded-xl transition">
            <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-inner"></div>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Warna</span>
          </button>
          <button onClick={handleCopy} className="flex flex-col items-center justify-center gap-1 w-14 h-12 hover:bg-gray-800 rounded-xl transition text-gray-300">
            <i className="ph-bold ph-copy text-[18px]"></i>
            <span className="text-[9px] font-bold uppercase tracking-wider">Salin</span>
          </button>
          <button onClick={openNoteModal} className="flex flex-col items-center justify-center gap-1 w-14 h-12 hover:bg-gray-800 rounded-xl transition text-gray-300">
            <i className="ph-bold ph-pencil-simple text-[18px]"></i>
            <span className="text-[9px] font-bold uppercase tracking-wider">Catat</span>
          </button>
          <button onClick={() => { triggerAction('Link dibagikan!'); setSelectedVerses([]); }} className="flex flex-col items-center justify-center gap-1 w-14 h-12 hover:bg-gray-800 rounded-xl transition text-blue-400">
            <i className="ph-bold ph-share-network text-[18px]"></i>
            <span className="text-[9px] font-bold uppercase tracking-wider">Share</span>
          </button>
        </div>
        <div className="w-px h-8 bg-gray-700 mx-1"></div>
        <button onClick={() => setSelectedVerses([])} className="w-14 h-12 flex items-center justify-center hover:bg-gray-800 rounded-xl transition text-gray-400">
          <i className="ph-bold ph-x text-xl"></i>
        </button>
      </div>

      <nav className={`fixed left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-[2rem] px-6 py-3.5 flex justify-center gap-8 items-center z-40 w-max shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 ${(selectedVerses.length > 0 || isNoteModalOpen) ? 'bottom-[-100px] opacity-0 invisible' : 'bottom-6 opacity-100 visible'}`}>
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

      <div className={`fixed left-1/2 -translate-x-1/2 bg-[#1a1d23] text-white px-5 py-3 rounded-full text-[13px] font-semibold shadow-2xl transition-all duration-300 z-[130] flex items-center gap-2 border border-gray-800 ${showToast ? 'top-6 opacity-100 scale-100' : '-top-10 opacity-0 scale-95'}`}>
        <i className="ph-fill ph-check-circle text-green-400 text-lg"></i>
        <span>{toastMsg}</span>
      </div>
    </div>
  );
}