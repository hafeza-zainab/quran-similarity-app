const API_BASE = 'http://localhost:3000/api/diary';
const getAuthHeader = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` });
export const addLog = async (logData) => { const res = await fetch(`${API_BASE}/log`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(logData) }); return await res.json(); };
export const getLogs = async (date) => { const res = await fetch(`${API_BASE}/logs?date=${date}`, { headers: getAuthHeader() }); return await res.json(); };
export const saveReflection = async (text) => { const res = await fetch(`${API_BASE}/reflection`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify({ reflection: text }) }); return await res.json(); };
export const getReflection = async (date) => { const res = await fetch(`${API_BASE}/reflection?date=${date}`, { headers: getAuthHeader() }); return await res.json(); };