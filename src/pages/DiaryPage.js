import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { addLog, getLogs, saveReflection, getReflection } from '../services/diaryApi';
import AnalyticsView from '../components/AnalyticsView';
import DailyTasksPage from '../components/DailyTasksPage';
import '../styles/DiaryPage.css';

const SURAH_LIST = [
    "1 - Al-Fatihah","2 - Al-Baqarah","3 - Aal-E-Imran","4 - An-Nisa","5 - Al-Ma'idah","6 - Al-An'am","7 - Al-A'raf","8 - Al-Anfal","9 - At-Tawbah","10 - Yunus","11 - Hud","12 - Yusuf","13 - Ar-Ra'd","14 - Ibrahim","15 - Al-Hijr","16 - An-Nahl","17 - Al-Isra","18 - Al-Kahf","19 - Maryam","20 - Taha","21 - Al-Anbiya","22 - Al-Hajj","23 - Al-Mu'minun","24 - An-Nur","25 - Al-Furqan","26 - Ash-Shu'ara","27 - An-Naml","28 - Al-Qasas","29 - Al-Ankabut","30 - Ar-Rum","31 - Luqman","32 - As-Sajdah","33 - Al-Ahzab","34 - Saba","35 - Fatir","36 - Ya-Sin","37 - As-Saffat","38 - Sad","39 - Az-Zumar","40 - Ghafir","41 - Fussilat","42 - Ash-Shura","43 - Az-Zukhruf","44 - Ad-Dukhan","45 - Al-Jathiyah","46 - Al-Ahqaf","47 - Muhammad","48 - Al-Fath","49 - Al-Hujurat","50 - Qaf","51 - Adh-Dhariyat","52 - At-Tur","53 - An-Najm","54 - Al-Qamar","55 - Ar-Rahman","56 - Al-Waqi'ah","57 - Al-Hadid","58 - Al-Mujadila","59 - Al-Hashr","60 - Al-Mumtahanah","61 - As-Saff","62 - Al-Jumu'ah","63 - Al-Munafiqun","64 - At-Taghabun","65 - At-Talaq","66 - At-Tahrim","67 - Al-Mulk","68 - Al-Qalam","69 - Al-Haqqah","70 - Al-Ma'arij","71 - Nuh","72 - Al-Jinn","73 - Al-Muzzammil","74 - Al-Muddaththir","75 - Al-Qiyamah","76 - Al-Insan","77 - Al-Mursalat","78 - An-Naba","79 - An-Nazi'at","80 - Abasa","81 - At-Takwir","82 - Al-Infitar","83 - Al-Inshiqaq","84 - Al-Buruj","85 - At-Tariq","86 - Al-A'la","87 - Al-Ghashiyah","88 - Al-Fajr","89 - Al-Balad","90 - Ash-Shams","91 - Al-Layl","92 - Ad-Duhaa","93 - Ash-Sharh","94 - At-Tin","95 - Al-Alaq","96 - Al-Qadr","97 - Al-Bayyinah","98 - Az-Zalzalah","99 - Al-Adiyat","100 - Al-Qari'ah","101 - At-Takathur","102 - Al-Asr","103 - Al-Humazah","104 - Al-Fil","105 - Quraysh","106 - Al-Ma'un","107 - Al-Kawthar","108 - Al-Kafirun","109 - An-Nasr","110 - Al-Masad","111 - Al-Ikhlas","112 - Al-Falaq","113 - An-Nas"
];
const TABS = [{ id: 'murajah', label: 'Murajah' }, { id: 'jadeed', label: 'Jadeed' }, { id: 'juzz_hali', label: 'Juzz Hali' }, { id: 'tasmee', label: 'Tasmee' }];

const DiaryPage = () => {
    const { user } = useAuthContext();
    const [activeDate, setActiveDate] = useState(new Date().toISOString().split('T')[0]);
    const [transitionClass, setTransitionClass] = useState('');
    const [viewMode, setViewMode] = useState('logs');
    
    const [activeTab, setActiveTab] = useState('murajah');
    const [logs, setLogs] = useState([]);
    const [juzzEntries, setJuzzEntries] = useState([]);
    
    const [fromSurah, setFromSurah] = useState('');
    const [fromAyah, setFromAyah] = useState('');
    const [toSurah, setToSurah] = useState('');
    const [toAyah, setToAyah] = useState('');
    const [score, setScore] = useState(8);
    const [timeSpent, setTimeSpent] = useState(15);
    const [difficulty, setDifficulty] = useState(3);
    const [notes, setNotes] = useState('');
    
    const [hifzToday, setHifzToday] = useState('');
    const [targetTomorrow, setTargetTomorrow] = useState('');
    const [planAction, setPlanAction] = useState('');
    const [saveStatus, setSaveStatus] = useState('');

    const getYesterday = () => { const d = new Date(activeDate + 'T00:00:00'); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; };
    const getTomorrow = () => { const d = new Date(activeDate + 'T00:00:00'); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; };
    const isToday = activeDate === new Date().toISOString().split('T')[0];
    const isYesterday = activeDate === getYesterday();
    
    const formatDisplayDate = (dateStr) => {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    };

    const handleNavChange = (newDate, direction) => {
        if (newDate < '2020-01-01') return;
        setTransitionClass(`slide-${direction}`);
        setTimeout(() => {
            setActiveDate(newDate);
            setTransitionClass('slide-in-active');
            setTimeout(() => setTransitionClass(''), 300);
        }, 50);
    };

    useEffect(() => { loadLogs(); loadReflection(); }, [activeDate]);

    const addNewJuzzBlock = () => {
        setJuzzEntries([...juzzEntries, { juzz: null, score: 8, time_spent: 15, difficulty: 3, notes: '' }]);
    };

    const handleEntryChange = (index, field, value) => { 
        const u = [...juzzEntries]; 
        u[index][field] = value; 
        setJuzzEntries(u); 
    };

    const loadLogs = async () => { 
        try { 
            const d = await getLogs(activeDate); 
            if (d.success) setLogs(d.data); 
        } catch (err) { console.error("Log load error:", err.message); }
    };
    
    const loadReflection = async () => {
        try {
            const d = await getReflection(activeDate);
            if (d.success && d.data) {
                setHifzToday(d.data.hifz_today || '');
                setTargetTomorrow(d.data.target_tomorrow || '');
                setPlanAction(d.data.plan_action || '');
            } else {
                setHifzToday(''); setTargetTomorrow(''); setPlanAction('');
            }
        } catch (err) { console.error("Reflection load error:", err.message); }
    };

    const handleLogSubmit = async (e) => {
        e.preventDefault(); 
        let payload = { date: activeDate, type: activeTab };
        
        if (activeTab === 'murajah' || activeTab === 'tasmee') { 
            payload.entries = juzzEntries.map(e => ({ 
                juzz: Number(e.juzz), 
                score: Number(e.score), 
                time_spent: Number(e.time_spent), 
                difficulty: Number(e.difficulty), 
                notes: e.notes || '' 
            })); 
        } else { 
            payload.score = Number(score); 
            payload.time_spent = Number(timeSpent); 
            payload.difficulty = Number(difficulty); 
            payload.notes = notes; 
            payload.range_from_surah = fromSurah; 
            payload.range_from_ayah = Number(fromAyah); 
            payload.range_to_surah = toSurah; 
            payload.range_to_ayah = Number(toAyah); 
        }
        
        try { 
            const res = await addLog(payload); 
            if (res.success) { 
                alert("Saved to " + payload.date + " successfully!"); 
                loadLogs(); 
                setJuzzEntries([]); 
                setFromSurah(''); setFromAyah(''); setToSurah(''); setToAyah(''); setNotes(''); 
            } else alert("Error: " + res.message); 
        } catch (err) { alert("Network Error"); }
    };

    const handleAutoSaveReflection = async (field, value) => {
        let updatedHifz = hifzToday, updatedTarget = targetTomorrow, updatedPlan = planAction;
        if (field === 'hifz') { setHifzToday(value); updatedHifz = value; }
        if (field === 'target') { setTargetTomorrow(value); updatedTarget = value; }
        if (field === 'plan') { setPlanAction(value); updatedPlan = value; }
        setSaveStatus('Saving...');
        try { 
            await saveReflection({ date: activeDate, hifz_today: updatedHifz, target_tomorrow: updatedTarget, plan_action: updatedPlan }); 
            setTimeout(() => setSaveStatus('Saved ✓'), 1000); 
        } catch (err) { setSaveStatus('Error'); }
    };

    if (!user) return <div className="auth-container"><div className="auth-card"><h2>Please Login</h2></div></div>;

    return (
        <div className="diary-page-container">
            <DailyTasksPage activeDate={activeDate} />
            
            <div className="view-toggle">
                <button onClick={() => setViewMode('logs')} className={viewMode === 'logs' ? 'active' : ''}>📝 Log Entry</button>
                <button onClick={() => setViewMode('analytics')} className={viewMode === 'analytics' ? 'active' : ''}>📊 Analytics</button>
            </div>

            {viewMode === 'logs' ? (
                <div className={`diary-book ${transitionClass}`}>
                    <div className="diary-nav-header">
                        <button className="nav-arrow" onClick={() => handleNavChange(getYesterday(), 'left')} disabled={activeDate <= '2020-01-01'}>←</button>
                        
                        <div className="nav-center">
                            {isYesterday && <span className="context-badge">Yesterday</span>}
                            <input 
                                type="date" 
                                value={activeDate} 
                                onChange={(e) => handleNavChange(e.target.value, 'right')} 
                                className="date-picker"
                            />
                            {isToday && <span className="context-badge today-badge">Today</span>}
                            {!isToday && <button onClick={() => handleNavChange(new Date().toISOString().split('T')[0], 'right')} className="today-btn">Go to Today</button>}
                        </div>

                        <button className="nav-arrow" onClick={() => handleNavChange(getTomorrow(), 'right')}>→</button>
                    </div>

                    <div className="diary-page-content">
                        <div className="diary-card"><h3>Log New Entry</h3>
                            <div className="diary-tabs">{TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={activeTab === tab.id ? 'active' : ''}>{tab.label}</button>))}
                            </div>
                            
                            <form onSubmit={handleLogSubmit} className="log-form">
                                {(activeTab === 'murajah' || activeTab === 'tasmee') ? (
                                    <>
                                        {juzzEntries.length === 0 && (
                                            <div className="add-juzz-prompt" onClick={addNewJuzzBlock}>
                                                <span>+</span> Click here to add the first Juzz
                                            </div>
                                        )}

                                        <div className="juzz-blocks-container">
                                            {juzzEntries.map((entry, index) => (
                                                <div key={index} className="juzz-individual-block">
                                                    <div className="juzz-block-header">
                                                        <h4>Enter Juzz Number:</h4>
                                                        {juzzEntries.length > 1 && (
                                                            <button type="button" className="remove-juzz-btn" onClick={() => setJuzzEntries(juzzEntries.filter((_, i) => i !== index))} title="Remove block">✕</button>
                                                        )}
                                                    </div>
                                                    <div className="form-row metrics compact">
                                                        <div style={{flex: 1}}>
                                                            <label>Juzz No:</label>
                                                            <input 
                                                                type="number" 
                                                                min="1" 
                                                                max="30" 
                                                                placeholder="e.g., 5" 
                                                                value={entry.juzz === null ? '' : entry.juzz} 
                                                                onChange={e => handleEntryChange(index, 'juzz', e.target.value)} 
                                                                required 
                                                            />
                                                        </div>
                                                        <div className="metric-group">
                                                            <label>Score: <strong style={{color: entry.score <= 5 ? '#DC2626' : entry.score <= 8 ? '#EAB308' : '#16A34A'}}>{entry.score}</strong></label>
                                                            <input type="range" min="1" max="10" value={entry.score}
                                                            onChange={e => handleEntryChange(index, 'score', e.target.value)} style={{accentColor: entry.score <= 5 ? '#DC2626' : entry.score <= 8 ? '#EAB308' : '#16A34A'}} />
                                                        </div>
                                                        <div className="metric-group">
                                                            <label>Time: <strong>{entry.time_spent}m</strong></label>
                                                            <input type="number" min="5" max="300" value={entry.time_spent} onChange={e => handleEntryChange(index, 'time_spent', e.target.value)} />
                                                        </div>
                                                        <div className="metric-group">
                                                            <label>Difficulty: <strong style={{color: entry.difficulty <= 2 ? '#DC2626' : entry.difficulty <= 3 ? '#EAB308' : '#16A34A'}}>{entry.difficulty}</strong></label>
                                                            <input type="range" min="1" max="5" value={entry.difficulty} onChange={e => handleEntryChange(index, 'difficulty', e.target.value)} style={{accentColor: entry.difficulty <= 2 ? '#DC2626' : entry.difficulty <= 3 ? '#EAB308' : '#16A34A'}} />
                                                        </div>
                                                    </div>
                                                    <textarea placeholder={`Notes for Juzz ${entry.juzz || 'X'}...`} value={entry.notes} onChange={e => handleEntryChange(index, 'notes', e.target.value)} rows={2}></textarea>
                                                </div>
                                            ))}
                                        </div>

                                        <button type="button" className="add-another-juzz-btn" onClick={addNewJuzzBlock}>
                                            + Add Another Juzz
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-row-multi">
                                            <div className="range-group"><label>From:</label><div className="surah-ayah-inputs"><input list="surah-options" type="text" placeholder="Surah" value={fromSurah} onChange={e => setFromSurah(e.target.value)} required />
                                            <datalist id="surah-options">{SURAH_LIST.map(s => <option key={s} value={s} />)}</datalist><input type="number" min="1" placeholder="Ayah" value={fromAyah} onChange={e => setFromAyah(e.target.value)} required /></div></div>
                                        </div>
                                        <span className="arrow-divider">→</span>
                                        <div className="range-group"><label>To:</label><div className="surah-ayah-inputs"><input list="surah-options-2" type="text" placeholder="Surah" value={toSurah} onChange={e => setToSurah(e.target.value)} required /><datalist id="surah-options-2">{SURAH_LIST.map(s => <option key={s} value={s} />)}</datalist><input type="number" min="1" placeholder="Ayah" value={toAyah} onChange={e => setToAyah(e.target.value)} required /></div></div>
                                        
                                        <div className="form-row metrics">
                                            <div className="metric-group"><label>Score (1-10): <strong style={{color: score <= 5 ? '#DC2626' : score <= 8 ? '#EAB308' : '#16A34A'}}>{score}</strong></label><input type="range" min="1" max="10" value={score} onChange={e => setScore(e.target.value)} style={{accentColor: score <= 5 ? '#DC2626' : score <= 8 ? '#EAB308' : '#16A34A'}} /></div>
                                            <div className="metric-group"><label>Time (min): <strong>{timeSpent}</strong></label><input type="number" min="5" max="300" value={timeSpent} onChange={e => setTimeSpent(e.target.value)} /></div>
                                            <div className="metric-group"><label>Difficulty (1-5): <strong style={{color: difficulty <= 2 ? '#DC2626' : difficulty <= 3 ? '#EAB308' : '#16A34A'}}>{difficulty}</strong></label><input type="range" min="1" max="5" value={difficulty} onChange={e => setDifficulty(e.target.value)} style={{accentColor: difficulty <= 2 ? '#DC2626' : difficulty <= 3 ? '#EAB308' : '#16A34A'}} /></div>
                                        </div>
                                        <textarea placeholder="Notes..." value={notes} onChange={e => setNotes(e.target.value)} rows={3}></textarea>
                                    </>
                                )}
                                <button type="submit" className="submit-btn">Save Log</button>
                            </form>
                        </div>

                        <div className="diary-card">
                            <h3>History for {formatDisplayDate(activeDate)}</h3>
                            {logs.length === 0 ? 
                                <p className="empty-state">No logs recorded for this exact day.</p> 
                                : 
                                <div className="logs-list">
                                    {logs.map(log => (
                                        <div key={log.id} className="log-item">
                                            <div className="log-header">
                                                <span className="log-type">{log.type.replace('_',' ').toUpperCase()}</span>
                                                <span>{log.range_from} {log.range_to ? `→ ${log.range_to}` : ''}</span>
                                            </div>
                                            <div className="log-stats">
                                                <span>Score: {log.score}/10</span>
                                                <span>Time: {log.time_spent}m</span>
                                            </div>
                                            {log.notes && <p className="log-notes">{log.notes}</p>}
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                        
                        <div className="diary-card reflection-card">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                                <h3 style={{margin: 0}}>Reflections for {formatDisplayDate(activeDate)}</h3>
                                {saveStatus && <span className="save-status-text">{saveStatus}</span>}
                            </div>
                            <div className="reflection-grid">
                                <div className="reflection-field">
                                    <label>1) How was your Hifz today?</label>
                                    <textarea 
                                        placeholder="Reflect on your session..." 
                                        value={hifzToday} 
                                        onChange={(e) => handleAutoSaveReflection('hifz', e.target.value)} 
                                        onBlur={(e) => handleAutoSaveReflection('hifz', e.target.value)} 
                                        rows={4}></textarea>
                                </div>
                                <div className="reflection-field">
                                    <label>2) What's the target for tomorrow?</label>
                                    <textarea 
                                        placeholder="Pages, Juzz, Surahs..." 
                                        value={targetTomorrow} 
                                        onChange={(e) => handleAutoSaveReflection('target', e.target.value)} 
                                        onBlur={(e) => handleAutoSaveReflection('target', e.target.value)} 
                                        rows={3}></textarea>
                                </div>
                                <div className="reflection-field">
                                    <label>3) What is your plan of action?</label>
                                    <textarea 
                                        placeholder="Time blocks, techniques..." 
                                        value={planAction} 
                                        onChange={(e) => handleAutoSaveReflection('plan', e.target.value)} 
                                        onBlur={(e) => handleAutoSaveReflection('plan', e.target.value)} 
                                        rows={3}></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <AnalyticsView activeDate={activeDate} />
            )}
        </div>
    );
};
export default DiaryPage;