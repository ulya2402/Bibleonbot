-- Tabel Ayat Hari Ini
CREATE TABLE IF NOT EXISTS daily_verse (
    id INTEGER PRIMARY KEY DEFAULT 1,
    reference TEXT,
    text TEXT
);
-- Isi ayat bawaan
INSERT OR IGNORE INTO daily_verse (id, reference, text) VALUES (1, 'Yohanes 3:16', 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.');

-- Tabel Berita
CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    category TEXT,
    image_url TEXT,
    link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Komunitas & Channel
CREATE TABLE IF NOT EXISTS communities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    member_count TEXT,
    category TEXT,
    link TEXT,
    is_channel INTEGER DEFAULT 0
);