CREATE TABLE IF NOT EXISTS bible_verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book TEXT,
    chapter INTEGER,
    verse INTEGER,
    content TEXT,
    translation TEXT
    title TEXT
);

CREATE INDEX IF NOT EXISTS idx_bible_lookup ON bible_verses(translation, book, chapter, verse);

CREATE TABLE IF NOT EXISTS saved_verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    book TEXT,
    chapter INTEGER,
    verse INTEGER,
    content TEXT,
    color TEXT,
    note TEXT,
    version TEXT DEFAULT 'AYT',
    labels TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);