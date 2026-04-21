import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getChartData, getJuzzHistory, deleteLog } from '../services/analyticsApi';
import '../styles/AnalyticsView.css';

const AnalyticsView = ({ activeDate }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('murajah');
    const [selectedJuzz, setSelectedJuzz] = useState('1');
    const [selectedType, setSelectedType] = useState('murajah');
    const [juzzHistory, setJuzzHistory] = useState([]);
    const [updateKey, setUpdateKey] = useState(0);

    useEffect(() => { loadChartData(); }, [activeDate]);
    useEffect(() => { loadJuzzHistory(); }, [selectedJuzz, selectedType, updateKey]);

    const loadChartData = async () => {
        const res = await getChartData(activeDate);
        if (res.success) {
            setData(res.data);
            setLoading(false);
        }
    };

    const loadJuzzHistory = async () => {
        const res = await getJuzzHistory(selectedJuzz, selectedType);
        if (res.success) setJuzzHistory(res.data);
    };

    const handleDeleteLog = async (log_date, source_surah, source_ayah) => {
        if (window.confirm('Delete this log?')) {
            deleteLog(log_date, source_surah, source_ayah).then(() => {
                loadChartData();
                setUpdateKey(prev => prev + 1);
            });
        }
    };

    if (loading) return <div className="loading-chart">Calculating Insights...</div>;
    if (!data || (data.typeData.length === 0 && data.weeklyData.length === 0))
        return <div className="empty-chart">Log some entries to see your analytics here!</div>;

    const filteredTypeData = data.typeData.filter(d => {
        if (activeDate) return d.date === activeDate;
        if (activeFilter !== 'all') return d.type === activeFilter;
        return true;
    });

    const formattedWeekly = activeDate
        ? data.weeklyData
              .filter(d => d.date === activeDate)
              .map(d => ({
                  ...d,
                  dayName: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })
              }))
        : data.weeklyData;

    return (
        <div className="analytics-container">
            <div className="chart-card deep-dive-card">
                <h3>🔍 Deep Dive: Individual Juzz Analysis</h3>
                <div className="deep-dive-controls">
                    <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="deep-select">
                        <option value="murajah">Murajah</option>
                        <option value="tasmee">Tasmee</option>
                    </select>

                    <select value={selectedJuzz} onChange={e => setSelectedJuzz(e.target.value)} className="deep-select">
                        {[...Array(30)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>Juzz {i + 1}</option>
                        ))}
                    </select>
                </div>

                {juzzHistory.length > 0 ? (
                    <div className="history-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Score</th>
                                    <th>Time (min)</th>
                                    <th>Difficulty</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {juzzHistory.map((row, idx) => (
                                    <tr key={idx} className={row.score < 7 ? 'weak-row' : ''}>
                                        <td>{row.log_date}</td>
                                        <td className="score-cell">{row.score}/10</td>
                                        <td>{row.time_spent}m</td>
                                        <td>{row.difficulty}/5</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteLog(row.log_date, row.source_surah, row.source_ayah)}
                                                className="icon-btn delete"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="empty-chart" style={{ padding: '20px' }}>
                        No history found for Juzz {selectedJuzz} on this date.
                    </p>
                )}
            </div>

            <div className="chart-card">
                <h3>7-Day Performance Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedWeekly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="dayName" stroke="#6B7280" />
                        <YAxis domain={[0, 10]} stroke="#6B7280" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="avgScore" stroke="#004D40" strokeWidth={3} name="Avg Score" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="filter-buttons">
                {['all', 'murajah', 'jadeed', 'juzz_hali', 'tasmee'].map(type => (
                    <button
                        key={type}
                        onClick={() => setActiveFilter(type)}
                        className={activeFilter === type ? 'active' : ''}
                    >
                        {type === 'all' ? 'All Categories' : type.replace('_', ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="chart-card">
                <h3>Score by Range</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={filteredTypeData} layout="vertical" margin={{ left: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" domain={[0, 10]} stroke="#6B7280" />
                        <YAxis dataKey="name" type="category" stroke="#6B7280" width={70} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avgScore" fill="#004D40" radius={[0, 4, 4, 0]} name="Avg Score" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsView;