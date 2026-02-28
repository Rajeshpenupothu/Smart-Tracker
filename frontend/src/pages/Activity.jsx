import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API_URL from '../api';

const Activity = () => {
    const [viewMode, setViewMode] = useState('jump'); // 'jump' or 'favorites'
    const [datePickerVal, setDatePickerVal] = useState('');

    const [specialDays, setSpecialDays] = useState([]);
    const [allLogs, setAllLogs] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null);

    const navigate = useNavigate();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        if (viewMode === 'favorites') {
            fetchSpecialDays();
        } else {
            fetchAllLogs();
        }
    }, [viewMode]);

    const fetchSpecialDays = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/special-days`);
            setSpecialDays(res.data);
        } catch (error) {
            console.error("Error fetching special days:", error);
        }
    };

    const fetchAllLogs = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/tasks`);
            // Only keep logs that actually have some progress marked
            setAllLogs(res.data.filter(log => log.hasProgress));
        } catch (error) {
            console.error("Error fetching all logs:", error);
        }
    };

    const handleDeleteSpecialDay = async (id) => {
        if (window.confirm("Are you sure you want to remove this special day?")) {
            try {
                await axios.delete(`${API_URL}/api/special-days/${id}`);
                setSpecialDays(specialDays.filter(sd => sd.id !== id));
            } catch (error) {
                console.error("Error deleting special day:", error);
            }
        }
    };

    const handleJumpToLog = (dateString) => {
        if (!dateString) return;
        localStorage.setItem('selectedDate', dateString);
        navigate('/');
    };

    // Filter special days by selected month
    const filteredSpecialDays = selectedMonth !== null
        ? specialDays.filter(sd => {
            const [year, month, day] = sd.date.split('-');
            const monthIndex = parseInt(month, 10) - 1;
            return monthIndex === selectedMonth;
        })
        : specialDays;

    return (
        <div className="container">
            <h1 className="welcome-text" style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '0' }}>Activity Hub</h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', backgroundColor: '#161b22', borderRadius: '8px', padding: '5px', border: '1px solid #30363d' }}>
                    <button
                        onClick={() => setViewMode('jump')}
                        style={{
                            padding: '10px 30px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: viewMode === 'jump' ? '#2ea043' : 'transparent',
                            color: viewMode === 'jump' ? 'white' : '#8b949e',
                            cursor: 'pointer',
                            fontWeight: viewMode === 'jump' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        📅 Jump to Date
                    </button>
                    <button
                        onClick={() => setViewMode('favorites')}
                        style={{
                            padding: '10px 30px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: viewMode === 'favorites' ? '#2ea043' : 'transparent',
                            color: viewMode === 'favorites' ? 'white' : '#8b949e',
                            cursor: 'pointer',
                            fontWeight: viewMode === 'favorites' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        ⭐ Favorites Only
                    </button>
                </div>
            </div>

            {viewMode === 'favorites' && (
                <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '2rem' }}>
                        <button
                            onClick={() => setSelectedMonth(null)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '20px',
                                border: '1px solid #30363d',
                                backgroundColor: selectedMonth === null ? '#00ff9d' : '#21262d',
                                color: selectedMonth === null ? '#0d1117' : 'white',
                                cursor: 'pointer',
                                fontWeight: selectedMonth === null ? 'bold' : 'normal'
                            }}
                        >
                            All Year
                        </button>
                        {months.map((month, index) => {
                            const count = specialDays.filter(sd => {
                                const [y, m, d] = sd.date.split('-');
                                return (parseInt(m, 10) - 1) === index;
                            }).length;
                            return (
                                <button
                                    key={month}
                                    onClick={() => setSelectedMonth(index)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '20px',
                                        border: '1px solid #30363d',
                                        backgroundColor: selectedMonth === index ? '#00ff9d' : '#21262d',
                                        color: selectedMonth === index ? '#0d1117' : 'white',
                                        cursor: 'pointer',
                                        fontWeight: selectedMonth === index ? 'bold' : 'normal'
                                    }}
                                >
                                    {month} {count > 0 && <span style={{ marginLeft: '5px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>{count}</span>}
                                </button>
                            );
                        })}
                    </div>

                    {filteredSpecialDays.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#161b22', borderRadius: '8px', border: '1px dashed #30363d' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                            <h3 style={{ color: '#8b949e', fontWeight: '400' }}>No special days marked {selectedMonth !== null ? 'in ' + months[selectedMonth] : 'yet'}.</h3>
                            <p style={{ color: '#484f58', fontSize: '0.9rem' }}>Go to your daily log and click "Mark as Special Day" to add one!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {filteredSpecialDays.map(sd => {
                                const [y, m, d] = sd.date.split('-');
                                const dateObj = new Date(y, m - 1, d);
                                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                                return (
                                    <div key={sd.id} className="section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#00ff9d', marginBottom: '0.5rem' }}>{formattedDate}</div>
                                            <h3 style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.2rem' }}>⭐ {sd.title}</h3>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #30363d', paddingTop: '1rem', marginTop: '1rem' }}>
                                            <button
                                                onClick={() => handleJumpToLog(sd.date)}
                                                style={{ background: 'none', border: 'none', color: '#58a6ff', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                                            >
                                                View Log ↗
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSpecialDay(sd.id)}
                                                style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer', fontSize: '0.9rem', padding: 0 }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {viewMode === 'jump' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                        <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                            <div style={{ textAlign: 'center', color: '#8b949e', fontSize: '0.9rem', marginBottom: '10px' }}>Select log to view</div>
                            <Calendar
                                className="dark-theme-calendar"
                                onChange={(date) => {
                                    const offset = date.getTimezoneOffset()
                                    date = new Date(date.getTime() - (offset * 60 * 1000))
                                    const dateString = date.toISOString().split('T')[0];
                                    setDatePickerVal(dateString);
                                    handleJumpToLog(dateString);
                                }}
                                value={datePickerVal ? new Date(datePickerVal) : null}
                            />
                        </div>
                    </div>

                    <h2 style={{ borderBottom: '1px solid #30363d', paddingBottom: '1rem', marginBottom: '2rem', color: '#8b949e' }}>Recent Activity</h2>

                    {allLogs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#161b22', borderRadius: '8px', border: '1px dashed #30363d' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                            <h3 style={{ color: '#8b949e', fontWeight: '400' }}>No activity logs found.</h3>
                            <p style={{ color: '#484f58', fontSize: '0.9rem' }}>Start logging your progress in the Home planner!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                            {allLogs.map(log => {
                                const [y, m, d] = log.date.split('-');
                                const dateObj = new Date(y, m - 1, d);
                                const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });

                                // Build preview string logic
                                const prev = log.preview || {};
                                const details = [];
                                if (prev.leetCode) details.push('LeetCode: ✅');
                                if (prev.gfg) details.push('GFG: ✅');
                                if (prev.java) details.push('Java: ✅');
                                if (prev['book reading']) details.push('Books: ✅');
                                if (prev['new skill']) details.push('News: ✅');

                                return (
                                    <div key={log.id} className="section-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeftColor: '#3fb950' }}>
                                        <div>
                                            <div style={{ fontSize: '0.9rem', color: '#8b949e', marginBottom: '0.5rem' }}>{formattedDate}</div>
                                            <div style={{ margin: '0 0 1rem 0', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>Progress Logged</div>

                                            {/* PREVIEW DETAILS */}
                                            <div style={{ fontSize: '0.9rem', color: '#c9d1d9', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {details.length > 0 ? (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                        {details.map((d, i) => <span key={i} style={{ backgroundColor: '#21262d', padding: '2px 8px', borderRadius: '12px', border: '1px solid #30363d' }}>{d}</span>)}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#8b949e', fontStyle: 'italic' }}>Minor updates</span>
                                                )}

                                                {prev.notes && (
                                                    <div style={{ marginTop: '8px', padding: '6px 10px', backgroundColor: 'rgba(0,0,0,0.3)', borderLeft: '2px solid #58a6ff', color: '#8b949e', fontStyle: 'italic', fontSize: '0.85rem' }}>
                                                        "{prev.notes}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', borderTop: '1px solid #30363d', paddingTop: '1rem', marginTop: '1rem' }}>
                                            <button
                                                onClick={() => handleJumpToLog(log.date)}
                                                style={{ background: 'none', border: 'none', color: '#58a6ff', cursor: 'pointer', fontSize: '1rem', padding: 0, fontWeight: 'bold' }}
                                            >
                                                View Log ↗
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Activity;
