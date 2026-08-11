CREATE TABLE IF NOT EXISTS saved_verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT, -- Menyimpan ID Telegram pengguna agar datanya tidak tertukar
    book TEXT,
    chapter INTEGER,
    verse INTEGER,
    content TEXT,
    color TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);