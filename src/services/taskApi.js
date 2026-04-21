const API_BASE = 'http://localhost:3000/api/tasks';
const getAuthHeader = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` });

export const getStreak = async () => { 
    const res = await fetch(`${API_BASE}/streak`, { headers: getAuthHeader() }); 
    return await res.json(); 
};

export const getTasks = async (date) => { 
    const res = await fetch(`${API_BASE}?date=${date}`, { headers: getAuthHeader() }); 
    return await res.json(); 
};

export const addTask = async (data) => { 
    const res = await fetch(`${API_BASE}`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(data) }); 
    return await res.json(); 
};

export const updateTask = async (id, status) => { 
    const res = await fetch(`${API_BASE}/${id}`, { 
        method: 'PATCH', 
        headers: getAuthHeader(), 
        body: JSON.stringify({ status }) 
    }); 
    return await res.json(); 
};

export const editTaskTitle = async (id, title) => { 
    const res = await fetch(`${API_BASE}/${id}`, { 
        method: 'PUT', 
        headers: getAuthHeader(), 
        body: JSON.stringify({ title }) 
    }); 
    return await res.json(); 
};

export const deleteTask = async (id) => { 
    const res = await fetch(`${API_BASE}/${id}`, { 
        method: 'DELETE', 
        headers: getAuthHeader() 
    }); 
    return await res.json(); 
};