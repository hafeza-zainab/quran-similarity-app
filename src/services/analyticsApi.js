const API_BASE = 'http://localhost:3000/api/analytics';
const getAuthHeader = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` });

export const getChartData = async (date) => { 
    const res = await fetch(`${API_BASE}/charts?date=${date}`, { headers: getAuthHeader() }); 
    return await res.json(); 
};
export const getJuzzHistory = async (juzz, type) => { 
    const res = await fetch(`${API_BASE}/juzz-history?juzz=${juzz}&type=${type}`, { headers: getAuthHeader() }); 
    return await res.json(); 
};
export const deleteLog = async (date, surah, ayah) => { 
    const res = fetch(`${API_BASE}/log?date=${date}&surah=${surah}&ayah=${ayah}`, { 
        method: 'DELETE', 
        headers: getAuthHeader() 
    }); 
    return await res.json(); 
};