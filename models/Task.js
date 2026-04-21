const db = require('../config/database');
const addTask = async (userId, title, category, date) => {
    return await db.run(`INSERT INTO tasks (user_id, title, category, status, date) VALUES (?, ?, ?, 'pending', ?)`, [userId, title, category, date]);
};
const getTasksByDate = async (userId, date) => db.all(`SELECT * FROM tasks WHERE user_id = ? AND date = ? ORDER BY category`, [userId, date]);
const updateTaskStatus = async (taskId, status, userId) => {
    return await db.run(`UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?`, [status, taskId, userId]);
};
const updateTaskTitle = async (taskId, title, userId) => {
    return await db.run(`UPDATE tasks SET title = ? WHERE id = ? AND user_id = ?`, [title, taskId, userId]);
};
const deleteTask = async (taskId, userId) => {
    return await db.run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [taskId, userId]);
};
module.exports = { addTask, getTasksByDate, updateTaskStatus, updateTaskTitle, deleteTask };