const db = require('../config/database');

const getSimilarities = async (surah, ayah) => {
    // Added a.name right after a.text
    const sql = `
        SELECT 
            s.target_surah, s.target_ayah, s.similarity_score, s.tips,
            a.text, a.juzz, a.marhala, a.name
        FROM similarities s
        JOIN ayahs a ON s.target_surah = a.surah AND s.target_ayah = a.ayah
        WHERE s.source_surah = ? AND s.source_ayah = ?
    `;
    return await db.all(sql, [surah, ayah]);
};

module.exports = { getSimilarities };