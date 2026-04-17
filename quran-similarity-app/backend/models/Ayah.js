const db = require('../config/database');

const getAyah = async (surah, ayah) => {
    const sql = `SELECT * FROM ayahs WHERE surah = ? AND ayah = ?`;
    return await db.get(sql, [surah, ayah]);
};

const getAllSurahs = async () => {
    // CHANGED: Added ", name" to this line!
    const sql = `SELECT DISTINCT surah, name FROM ayahs ORDER BY surah ASC`;
    return await db.all(sql);
};

const getAyahsBySurah = async (surah) => {
    const sql = `SELECT ayah FROM ayahs WHERE surah = ? ORDER BY ayah ASC`;
    return await db.all(sql, [surah]);
};

module.exports = { getAyah, getAllSurahs, getAyahsBySurah };