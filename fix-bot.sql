-- Hapus tabel users yang salah kemarin
DROP TABLE IF EXISTS users;

-- Buat tabel users baru dengan nama kolom yang persis dicari oleh Bot
CREATE TABLE users (
    telegram_id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    language TEXT DEFAULT 'id',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);