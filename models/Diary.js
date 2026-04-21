const db = require('../config/database');

const createLog = async (userId, type, rangeFrom, rangeTo, score, timeSpent, difficulty, notes, date) => {
    // ADDED source_surah and source_ayah so the delete button has the data it needs
    const sql = `INSERT INTO diary_logs (user_id, type, range_from, range_to, score, time_spent, difficulty, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return await db.run(sql, [userId, type, rangeFrom, rangeTo, score, timeSpent, difficulty, notes, date]);
};

const getLogsByDate = async (userId, date) => {
    // ADDED source_surah and source_ayah to the SELECT statement
    const sql = `SELECT source_surah, source_ahnayah, * FROM diary_logs WHERE user_id = ? AND DATE(created_at) = ? ORDER BY created_at DESC`;
    return await db.all(sql, [userId, date]);
};

const saveReflection = async (userId, date, reflection) => db.run(`INSERT OR REPLACE INTO daily_reflections (user_id, date, reflection) VALUES (?, ?, ?)`, [userId, date, reflection]);
const getReflection = async (userId, date) => db.get(`SELECT reflection FROM daily_reflections WHERE user_id = ? AND date = ?`, [userId, date]);
module.exports = { createLog, getLogsByDate, saveReflection, getReflection };