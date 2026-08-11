import { useState } from 'react';

const API_URL = 'https://bibleonbot-backend.rchtxtdev.workers.dev/api';

export default function AdminTab({ triggerAction, refreshHomeData, news = [], communities = [], channels = [], dailyVerse }: any) {
  // State Ayat
  const [dvRef, setDvRef] = useState(''); 
  const [dvText, setDvText] = useState('');
  
  // State Berita
  const [newsId, setNewsId] = useState<number | null>(null);
  const [newsTitle, setNewsTitle] = useState(''); 
  const [newsCategory, setNewsCategory] = useState('');
  const [newsLink, setNewsLink] = useState(''); 
  const [newsImage, setNewsImage] = useState('');
  
  // State Komunitas
  const [comId, setComId] = useState<number | null>(null);
  const [comName, setComName] = useState(''); 
  const [comMembers, setComMembers] = useState('');
  const [comCategory, setComCategory] = useState(''); 
  const [comLink, setComLink] = useState('');
  
  // State Channel
  const [chId, setChId] = useState<number | null>(null);
  const [chName, setChName] = useState(''); 
  const [chDesc, setChDesc] = useState('');
  const [chLink, setChLink] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // --- FUNGSI API ---
  const saveDailyVerse = async () => {
    if (!dvRef || !dvText) return triggerAction('Harap isi referensi & teks!');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/daily-verse`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reference: dvRef, text: dvText }) });
      if ((await res.json()).success) { triggerAction('Ayat Hari Ini Diperbarui!'); await refreshHomeData(); setDvRef(''); setDvText(''); }
    } catch (e) { triggerAction('Gagal menyimpan.'); }
    setIsLoading(false);
  };

  const handleEditNews = (n: any) => { setNewsId(n.id); setNewsTitle(n.title); setNewsCategory(n.category); setNewsLink(n.link); setNewsImage(n.image_url); triggerAction('✏️ Silakan edit di form atas'); };
  const handleDeleteNews = async (id: number) => {
    if(!confirm("Yakin hapus berita ini dari beranda?")) return;
    setIsLoading(true);
    await fetch(`${API_URL}/admin/news?id=${id}`, { method: 'DELETE' });
    await refreshHomeData(); triggerAction('🗑️ Berita Dihapus!'); setIsLoading(false);
  };
  const saveNews = async () => {
    if (!newsTitle || !newsLink) return triggerAction('Judul dan Link wajib diisi!');
    setIsLoading(true);
    const method = newsId ? 'PUT' : 'POST';
    await fetch(`${API_URL}/admin/news`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: newsId, title: newsTitle, category: newsCategory, image_url: newsImage, link: newsLink }) });
    triggerAction(newsId ? 'Berita Diperbarui!' : 'Berita Ditambahkan!');
    await refreshHomeData(); setNewsId(null); setNewsTitle(''); setNewsCategory(''); setNewsLink(''); setNewsImage(''); setIsLoading(false);
  };

  const handleEditCom = (c: any) => { setComId(c.id); setComName(c.name); setComMembers(c.member_count); setComCategory(c.category); setComLink(c.link); triggerAction('✏️ Silakan edit di form atas'); };
  const handleDeleteCom = async (id: number) => {
    if(!confirm("Yakin hapus komunitas ini?")) return;
    setIsLoading(true);
    await fetch(`${API_URL}/admin/community?id=${id}`, { method: 'DELETE' });
    await refreshHomeData(); triggerAction('🗑️ Komunitas Dihapus!'); setIsLoading(false);
  };
  const saveCommunity = async () => {
    if (!comName || !comLink) return triggerAction('Nama dan Link wajib diisi!');
    setIsLoading(true);
    const method = comId ? 'PUT' : 'POST';
    await fetch(`${API_URL}/admin/community`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: comId, name: comName, member_count: comMembers, category: comCategory, link: comLink, is_channel: 0 }) });
    triggerAction(comId ? 'Komunitas Diperbarui!' : 'Komunitas Ditambahkan!');
    await refreshHomeData(); setComId(null); setComName(''); setComMembers(''); setComCategory(''); setComLink(''); setIsLoading(false);
  };

  const handleEditCh = (ch: any) => { setChId(ch.id); setChName(ch.name); setChDesc(ch.category); setChLink(ch.link); triggerAction('✏️ Silakan edit di form atas'); };
  const handleDeleteCh = async (id: number) => {
    if(!confirm("Yakin hapus channel ini?")) return;
    setIsLoading(true);
    await fetch(`${API_URL}/admin/community?id=${id}`, { method: 'DELETE' });
    await refreshHomeData(); triggerAction('🗑️ Channel Dihapus!'); setIsLoading(false);
  };
  const saveChannel = async () => {
    if (!chName || !chLink) return triggerAction('Nama dan Link wajib diisi!');
    setIsLoading(true);
    const method = chId ? 'PUT' : 'POST';
    await fetch(`${API_URL}/admin/community`, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: chId, name: chName, member_count: '', category: chDesc, link: chLink, is_channel: 1 }) });
    triggerAction(chId ? 'Channel Diperbarui!' : 'Channel Ditambahkan!');
    await refreshHomeData(); setChId(null); setChName(''); setChDesc(''); setChLink(''); setIsLoading(false);
  };

  return (
    <div className="animate-fadeIn px-5 pt-5 space-y-6 pb-10">
      <div className="mb-6">
        <h2 className="font-extrabold text-2xl tracking-tight text-gray-900">Kelola Aplikasi</h2>
        <p className="text-[13px] text-gray-500 font-medium mt-1">Data langsung sinkron ke halaman depan.</p>
      </div>

      {/* 1. AYAT HARI INI */}
      <div className="bg-white rounded-[1.25rem] border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gray-900 p-4 flex items-center justify-between">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><i className="ph-fill ph-sparkle text-yellow-400"></i> Ayat Hari Ini</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sedang Tampil:</p>
            <p className="text-[13px] font-bold text-gray-900">{dailyVerse?.verse_reference || 'Belum diatur'}</p>
            <p className="text-[12px] text-gray-700 line-clamp-2 mt-0.5 italic">"{dailyVerse?.verse_text || '-'}"</p>
          </div>
          <input value={dvRef} onChange={(e) => setDvRef(e.target.value)} type="text" placeholder="Referensi (Cth: Yohanes 3:16)" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-gray-900" />
          <textarea value={dvText} onChange={(e) => setDvText(e.target.value)} placeholder="Teks firman..." rows={3} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-gray-900"></textarea>
          <button onClick={saveDailyVerse} disabled={isLoading} className="w-full py-3 bg-gray-900 text-white font-bold text-[13px] rounded-xl active:scale-95 transition">Perbarui Ayat</button>
        </div>
      </div>

      {/* 2. KOMUNITAS */}
      <div className="bg-white rounded-[1.25rem] border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-blue-900 uppercase tracking-wider flex items-center gap-2"><i className="ph-fill ph-users-three"></i> Komunitas</h3>
        </div>
        {/* Form Komunitas */}
        <div className="p-4 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{comId ? '✏️ Mode Edit' : '➕ Tambah Baru'}</p>
          <input value={comName} onChange={(e) => setComName(e.target.value)} type="text" placeholder="Nama Komunitas" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500" />
          <div className="flex gap-2">
            <input value={comMembers} onChange={(e) => setComMembers(e.target.value)} type="text" placeholder="Anggota (2.4k)" className="w-1/2 bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500" />
            <input value={comCategory} onChange={(e) => setComCategory(e.target.value)} type="text" placeholder="Kategori (Doa/Diskusi)" className="w-1/2 bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500" />
          </div>
          <input value={comLink} onChange={(e) => setComLink(e.target.value)} type="url" placeholder="Link Telegram Grup" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500" />
          <div className="flex gap-2 pt-1">
            {comId && <button onClick={() => {setComId(null); setComName(''); setComMembers(''); setComCategory(''); setComLink('');}} className="w-1/3 py-3 bg-gray-100 text-gray-700 font-bold text-[13px] rounded-xl active:scale-95">Batal</button>}
            <button onClick={saveCommunity} disabled={isLoading} className="flex-1 py-3 bg-blue-600 text-white font-bold text-[13px] rounded-xl active:scale-95 transition">{comId ? 'Simpan Edit' : 'Tambah'}</button>
          </div>
        </div>
        {/* Daftar Komunitas */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Daftar Tersimpan ({communities.length})</p>
          <div className="space-y-3">
            {communities.length > 0 ? communities.map((c: any) => (
              <div key={c.id} className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm">
                <h4 className="font-bold text-[13px] text-gray-900">{c.name}</h4>
                <p className="text-[11px] text-gray-500 mb-3">{c.category} • {c.member_count}</p>
                <div className="flex gap-2 border-t border-gray-100 pt-3">
                  <button onClick={() => handleEditCom(c)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold transition hover:bg-blue-100">✏️ Edit</button>
                  <button onClick={() => handleDeleteCom(c.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold transition hover:bg-red-100">🗑️ Hapus</button>
                </div>
              </div>
            )) : <p className="text-xs text-gray-400 text-center italic py-2">Belum ada data.</p>}
          </div>
        </div>
      </div>

      {/* 3. CHANNEL */}
      <div className="bg-white rounded-[1.25rem] border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-purple-900 uppercase tracking-wider flex items-center gap-2"><i className="ph-fill ph-telegram-logo"></i> Channel Rekomendasi</h3>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{chId ? '✏️ Mode Edit' : '➕ Tambah Baru'}</p>
          <input value={chName} onChange={(e) => setChName(e.target.value)} type="text" placeholder="Nama Channel" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-purple-500" />
          <input value={chDesc} onChange={(e) => setChDesc(e.target.value)} type="text" placeholder="Deskripsi Singkat" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-purple-500" />
          <input value={chLink} onChange={(e) => setChLink(e.target.value)} type="url" placeholder="Link (YouTube / Telegram)" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-purple-500" />
          <div className="flex gap-2 pt-1">
            {chId && <button onClick={() => {setChId(null); setChName(''); setChDesc(''); setChLink('');}} className="w-1/3 py-3 bg-gray-100 text-gray-700 font-bold text-[13px] rounded-xl active:scale-95">Batal</button>}
            <button onClick={saveChannel} disabled={isLoading} className="flex-1 py-3 bg-purple-600 text-white font-bold text-[13px] rounded-xl active:scale-95 transition">{chId ? 'Simpan Edit' : 'Tambah'}</button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Daftar Tersimpan ({channels.length})</p>
          <div className="space-y-3">
            {channels.length > 0 ? channels.map((ch: any) => (
              <div key={ch.id} className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm">
                <h4 className="font-bold text-[13px] text-gray-900">{ch.name}</h4>
                <p className="text-[11px] text-gray-500 mb-3 line-clamp-1">{ch.category}</p>
                <div className="flex gap-2 border-t border-gray-100 pt-3">
                  <button onClick={() => handleEditCh(ch)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold transition hover:bg-blue-100">✏️ Edit</button>
                  <button onClick={() => handleDeleteCh(ch.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold transition hover:bg-red-100">🗑️ Hapus</button>
                </div>
              </div>
            )) : <p className="text-xs text-gray-400 text-center italic py-2">Belum ada data.</p>}
          </div>
        </div>
      </div>

      {/* 4. BERITA */}
      <div className="bg-white rounded-[1.25rem] border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-orange-900 uppercase tracking-wider flex items-center gap-2"><i className="ph-fill ph-newspaper"></i> Berita & Artikel</h3>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{newsId ? '✏️ Mode Edit' : '➕ Tambah Baru'}</p>
          <input value={newsTitle} onChange={(e) => setNewsTitle(e.target.value)} type="text" placeholder="Judul Berita" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-orange-500" />
          <input value={newsCategory} onChange={(e) => setNewsCategory(e.target.value)} type="text" placeholder="Kategori (ARTIKEL / BERITA)" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-orange-500" />
          <input value={newsImage} onChange={(e) => setNewsImage(e.target.value)} type="url" placeholder="Link Gambar Cover" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-orange-500" />
          <input value={newsLink} onChange={(e) => setNewsLink(e.target.value)} type="url" placeholder="Link Web Tujuan" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-orange-500" />
          <div className="flex gap-2 pt-1">
            {newsId && <button onClick={() => {setNewsId(null); setNewsTitle(''); setNewsCategory(''); setNewsLink(''); setNewsImage('');}} className="w-1/3 py-3 bg-gray-100 text-gray-700 font-bold text-[13px] rounded-xl active:scale-95">Batal</button>}
            <button onClick={saveNews} disabled={isLoading} className="flex-1 py-3 bg-orange-600 text-white font-bold text-[13px] rounded-xl active:scale-95 transition">{newsId ? 'Simpan Edit' : 'Tambah'}</button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Daftar Tersimpan ({news.length})</p>
          <div className="space-y-3">
            {news.length > 0 ? news.map((n: any) => (
              <div key={n.id} className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm">
                <h4 className="font-bold text-[13px] text-gray-900 line-clamp-1">{n.title}</h4>
                <p className="text-[11px] text-gray-500 mb-3">{n.category}</p>
                <div className="flex gap-2 border-t border-gray-100 pt-3">
                  <button onClick={() => handleEditNews(n)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold transition hover:bg-blue-100">✏️ Edit</button>
                  <button onClick={() => handleDeleteNews(n.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold transition hover:bg-red-100">🗑️ Hapus</button>
                </div>
              </div>
            )) : <p className="text-xs text-gray-400 text-center italic py-2">Belum ada data.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}