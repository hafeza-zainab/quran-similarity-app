-- Drop old tables to ensure a completely clean slate
DROP TABLE IF EXISTS similarities;
DROP TABLE IF EXISTS ayahs;

-- Create Ayahs Table
CREATE TABLE ayahs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    surah INTEGER NOT NULL,
    ayah INTEGER NOT NULL,
    text TEXT NOT NULL,
    juzz INTEGER NOT NULL,
    marhala TEXT NOT NULL,
    name TEXT,
    UNIQUE(surah, ayah)
);

-- Create Similarities Table
CREATE TABLE similarities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_surah INTEGER NOT NULL,
    source_ayah INTEGER NOT NULL,
    target_surah INTEGER NOT NULL,
    target_ayah INTEGER NOT NULL,
    similarity_score REAL NOT NULL,
    tips TEXT DEFAULT '[]',
    UNIQUE(source_surah, source_ayah, target_surah, target_ayah)
);

-- Performance Indexes
CREATE INDEX idx_source ON similarities(source_surah, source_ayah);
CREATE INDEX idx_target ON similarities(target_surah, target_ayah);
CREATE INDEX idx_juzz ON ayahs(juzz);