const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../data/quran.db');
const db = new sqlite3.Database(dbPath, (err) => { if(err) console.error(err); });

console.log("Adding diary tables...");
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS diary_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL, -- 'murajah', 'jadeed', 'juzz_hali', 'tasmee'
            range_from TEXT NOT NULL,
            range_to TEXT NOT NULL,
            score INTEGER NOT NULL CHECK(score >= 1 AND score <= 10), -- Standardized 1-10
            time_spent INTEGER NOT NULL, -- in minutes
            difficulty INTEGER DEFAULT 3 CHECK(difficulty >= 1 AND difficulty <= 5),
            notes TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS daily_reflections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            reflection TEXT NOT NULL,
            date TEXT NOT NULL UNIQUE, -- YYYY-MM-DD format
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    `);
});
db.close(() => console.log("✅ Diary tables ready!"));