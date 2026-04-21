import React, { useState, useEffect } from 'react';
import { getTasks, addTask, updateTask, editTaskTitle, deleteTask } from '../services/taskApi';
import '../styles/DailyTasks.css';

const CATEGORIES = ['murajah', 'juzz_hali', 'jadeed', 'tasmee', 'general'];
const MAX_CHARS = 60;

const DailyTasksPage = ({ activeDate }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [category, setCategory] = useState('murajah');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => { loadTasks(); }, [activeDate]);

    const loadTasks = async () => {
        try { 
            const res = await getTasks(activeDate); 
            if (res.success) setTasks(res.data); 
        } catch (err) { console.error("Task load error:", err.message); }
    };

    const handleAdd = async (e) => {
        e.preventDefault(); 
        if (!newTask || newTask.length > MAX_CHARS) return;
        const res = await addTask({ title: newTask, category });
        if (res.success) { setNewTask(''); loadTasks(); }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Delete this task?")) {
            deleteTask(id).then(() => loadTasks());
        }
    };

    const startEdit = (task) => { setEditingId(task.id); setEditText(task.title); };
    
    const saveEdit = async (id) => {
        if (editText.length > MAX_CHARS) return;
        await editTaskTitle(id, editText);
        setEditingId(null);
        loadTasks();
    };

    return (
        <div className="titles-card">
            <h3>Tasks & Targets</h3>
            <form onSubmit={handleAdd} className="task-form">
                <select value={category} onChange={e => setCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>)}
                </select>
                <div className="input-wrapper">
                    <input 
                        type="text" 
                        placeholder="e.g., Revise Juzz 10" 
                        value={newTask} 
                        onChange={e => { if(e.target.value.length <= MAX_CHARS) setNewTask(e.target.value); }} 
                        required 
                        maxLength={MAX_CHARS}
                    />
                    <span className="char-limit">{newTask.length}/{MAX_CHARS}</span>
                </div>
                <button type="submit">Add</button>
            </form>

            <div className="task-list">
                {tasks.length === 0 ? <p className="empty-tasks">No tasks set for this day.</p> : 
                    tasks.map(task => (
                        <div key={task.id} className={`task-item ${task.status}`}>
                            {editingId === task.id ? (
                                <div className="edit-wrapper">
                                    <input type="text" value={editText} onChange={e => setEditText(e.target.value)} autoFocus onKeyDown={e => e.key === 'Enter' && saveEdit(task.id)} />
                                    <button className="icon-btn save" onClick={() => saveEdit(task.id)}>✓</button>
                                </div>
                            ) : (
                                <div className="task-title">{task.title}</div>
                            )}
                            
                            <span className={`task-badge ${task.category}`}>{task.category.replace('_', ' ')}</span>
                            
                            <div className="task-actions">
                                {editingId !== task.id && <button className="icon-btn edit" onClick={() => startEdit(task)}>✏️</button>}
                                <button className="icon-btn delete" onClick={() => handleDelete(task.id)}>🗑️</button>
                                <select value={task.status} onChange={e => { updateTask(task.id, e.target.value); loadTasks(); }} className="task-status-select">
                                    <option value="pending">Not Started</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed ✓</option>
                                </select>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default DailyTasksPage;