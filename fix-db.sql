-- Tabel untuk menyimpan data Pengguna Telegram (Bot)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, -- ID Telegram Pengguna
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    locale TEXT DEFAULT 'id',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Channels (untuk berjaga-jaga jika API Anda mencarinya)
CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);