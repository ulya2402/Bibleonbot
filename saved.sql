DROP TABLE IF EXISTS saved_verses;

CREATE TABLE saved_verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    book TEXT,
    chapter INTEGER,
    verse INTEGER,
    content TEXT,
    color TEXT,
    note TEXT,
    version TEXT DEFAULT 'AYT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);