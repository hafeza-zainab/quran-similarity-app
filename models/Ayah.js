const db = require('../config/database');
const getAyah = async (surah, ayah) => db.get(`SELECT * FROM ayahs WHERE surah = ? AND ayah = ?`, [surah, ayah]);
const getAllSurahs = async () => db.all(`SELECT DISTINCT surah, name FROM ayahs ORDER BY surah ASC`);
const getAyahsBySurah = async (surah) => db.all(`SELECT ayah FROM ayahs WHERE surah = ? ORDER BY ayah ASC`, [surah]);
module.exports = { getAyah, getAllSurahs, getAyahsBySurah };
const getAyahContext = async (surah, ayah) => {
    const current = await db.get(`SELECT text FROM ayahs WHERE surah = ? AND ayah = ?`, [surah, ayah]);
    // If ayah is 1, previous will be null
    const prev = ayah > 1 ? await db.get(`SELECT text FROM ayahs WHERE surah = ? AND ayah = ?`, [surah, ayah - 1]) : null;
    const next = await db.get(`SELECT text FROM ayahs WHERE surah = ? AND ayah = ?`, [surah, ayah + 1]);
    
    return {
        prev: prev ? prev.text : null,
        current: current ? current.text : null,
        next: next ? next.text : null
    };
};

module.exports = { getAyah, getAllSurahs, getAyahsBySurah, getAyahContext };