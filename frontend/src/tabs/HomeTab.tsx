import { useState } from 'react';

export default function HomeTab({ dailyVerse, communities, channels, news }: any) {
  // Sistem Pintar "Load More"
  const [visibleComms, setVisibleComms] = useState(5);
  const [visibleNews, setVisibleNews] = useState(5);

  return (
    <div className="animate-fadeIn px-5 pt-5 space-y-8">
      
      {/* Card Ayat Hari Ini */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-[1.5rem] p-6 overflow-hidden shadow-lg">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute right-10 bottom-0 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Ayat Hari Ini</span>
            <i className="ph-fill ph-sparkle text-yellow-400 text-lg"></i>
          </div>
          <p className="text-lg font-medium leading-relaxed mb-3">
            {dailyVerse ? dailyVerse.verse_text : 'Memuat ayat...'}
          </p>
          <p className="text-sm text-gray-400 font-semibold">
            {dailyVerse ? `- ${dailyVerse.verse_reference}` : ''}
          </p>
        </div>
      </div>

      {/* Komunitas Section (Sesuai Desain HTML Anda) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-lg tracking-tight">Komunitas</h3>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">Disarankan</span>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {communities.slice(0, visibleComms).map((c: any, i: number) => {
            // Logika mendeteksi ikon berdasarkan kategori (Doa vs Diskusi)
            const isPrayer = c.category.toLowerCase().includes('doa');
            return (
              <div key={i} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isPrayer ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>
                    <i className={`text-lg ${isPrayer ? 'ph-fill ph-hands-praying' : 'ph-fill ph-users-three'}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{c.name}</h4>
                    <p className="text-[11px] text-gray-500 font-medium">{c.member_count} • {c.category}</p>
                  </div>
                </div>
                <button onClick={() => window.open(c.link, '_blank')} className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition shadow-sm">Gabung</button>
              </div>
            );
          })}
          {communities.length === 0 && <p className="text-xs text-gray-500 text-center py-2">Belum ada komunitas.</p>}
        </div>

        {/* Tombol Load More Komunitas */}
        {communities.length > visibleComms && (
          <button onClick={() => setVisibleComms(prev => prev + 5)} className="w-full py-2.5 text-[11px] font-bold uppercase tracking-wide text-gray-500 hover:text-gray-900 transition flex justify-center items-center gap-1">
            <span>Tampilkan lainnya</span>
            <i className="ph-bold ph-caret-down"></i>
          </button>
        )}
      </div>

      {/* Rekomendasi Channel (Desain Pisah Telegram & YouTube) */}
      <div className="space-y-3">
        <h3 className="font-bold text-lg tracking-tight px-1">Rekomendasi Channel</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {channels.map((ch: any, i: number) => {
            // Deteksi link Youtube vs Telegram
            const isYouTube = ch.link.toLowerCase().includes('youtube.com') || ch.link.toLowerCase().includes('youtu.be');

            if (isYouTube) {
              return (
                <div key={i} className="flex-none w-[180px] p-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-14 h-14 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="flex items-center gap-2 mb-3 relative z-10">
                    <i className="ph-fill ph-youtube-logo text-xl text-red-500 drop-shadow-sm"></i>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">YouTube</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight relative z-10">{ch.name}</h4>
                  <p className="text-[11px] text-gray-500 mb-4 mt-1 line-clamp-2 relative z-10">{ch.category}</p>
                  <button onClick={() => window.open(ch.link, '_blank')} className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-gray-200 transition relative z-10">Tonton</button>
                </div>
              );
            }

            // Default ke Tema Telegram
            return (
              <div key={i} className="flex-none w-[180px] p-3.5 bg-gradient-to-br from-[#2AABEE]/10 to-[#229ED9]/5 rounded-2xl border border-[#2AABEE]/20 relative">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-[#2AABEE] flex items-center justify-center text-white shadow-sm">
                    <i className="ph-fill ph-telegram-logo text-sm"></i>
                  </div>
                  <span className="text-[10px] font-bold text-[#2AABEE] uppercase tracking-wider">Telegram</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">{ch.name}</h4>
                <p className="text-[11px] text-gray-600 mb-4 mt-1 line-clamp-2">{ch.category}</p>
                <button onClick={() => window.open(ch.link, '_blank')} className="w-full py-2 bg-white text-[#2AABEE] text-[11px] font-bold uppercase tracking-wider rounded-xl border border-[#2AABEE]/30 shadow-sm">Buka App</button>
              </div>
            );
          })}
          {channels.length === 0 && <p className="text-xs text-gray-500 px-1">Belum ada channel.</p>}
        </div>
      </div>

      {/* Berita & Artikel Section */}
      <div className="pb-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-lg tracking-tight">Berita & Artikel</h3>
          <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">
            <i className="ph-bold ph-newspaper text-sm"></i>
          </button>
        </div>
        
        <div className="space-y-4">
          {news.slice(0, visibleNews).map((n: any, i: number) => {
            const isArticle = n.category.toLowerCase().includes('artikel');
            return (
              <div key={i} onClick={() => window.open(n.link, '_blank')} className="flex gap-4 items-center bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-gray-300 transition group">
                <img src={n.image_url} alt="Cover" className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 py-1 pr-2">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest mb-1.5 block ${isArticle ? 'text-blue-600' : 'text-orange-600'}`}>{n.category}</span>
                  <h4 className="font-bold text-[13px] leading-tight text-gray-900 line-clamp-2 mb-1.5 group-hover:text-blue-600 transition">{n.title}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                    <i className="ph-fill ph-clock"></i> Baru saja
                  </div>
                </div>
              </div>
            );
          })}
          {news.length === 0 && <p className="text-xs text-gray-500 text-center py-2">Belum ada berita.</p>}
        </div>

        {/* Tombol Load More Berita */}
        {news.length > visibleNews && (
          <button onClick={() => setVisibleNews(prev => prev + 5)} className="w-full py-3 text-[11px] font-bold uppercase tracking-wide text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition flex justify-center items-center gap-1.5 shadow-sm">
            <span>Tampilkan Berita Lainnya</span>
            <i className="ph-bold ph-arrow-down"></i>
          </button>
        )}
      </div>
    </div>
  );
}