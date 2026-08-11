-- Membuat tabel untuk Ayat Alkitab
CREATE TABLE IF NOT EXISTS bible_verses (
    id INTEGER PRIMARY KEY,
    book TEXT,
    chapter INTEGER,
    verse INTEGER,
    content TEXT,
    translation TEXT
);

-- Membuat tabel untuk Ayat yang Disimpan (Fitur Tab Tersimpan nanti)
CREATE TABLE IF NOT EXISTS saved_verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    verse_id INTEGER,
    color TEXT,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);