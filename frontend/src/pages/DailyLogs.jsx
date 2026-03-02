import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API_URL from '../api';
import { formatDisplayDate } from '../utils/dateUtils';

const DailyLogs = () => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [currentLog, setCurrentLog] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    useEffect(() => {
        fetchLogForDate(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        const handleCloseCalendars = () => setIsCalendarVisible(false);
        document.addEventListener('close-calendars', handleCloseCalendars);
        return () => document.removeEventListener('close-calendars', handleCloseCalendars);
    }, []);


    const fetchLogForDate = async (date) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/tasks/${date}?userEmail=${user.email}`);
            setCurrentLog(res.data.id ? res.data : null);
        } catch (error) {
            setCurrentLog(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        setSelectedDate(localDate.toISOString().split('T')[0]);
    };

    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#00ff9d' }}>Daily Logs</h1>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button
                    className="premium-toggle-btn"
                    onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                >
                    <span>📅 Choose date: </span>
                    <strong>{formatDisplayDate(selectedDate)}</strong>
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            marginLeft: '8px',
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isCalendarVisible ? 'rotate(180deg)' : 'rotate(0deg)',
                            opacity: 0.8,
                            color: isCalendarVisible ? '#00ff9d' : 'inherit'
                        }}
                    >
                        <path d="m6 9 6 6 6-6"></path>
                    </svg>
                </button>

                {isCalendarVisible && (
                    <div className="premium-calendar-container">
                        <Calendar
                            className="dark-theme-calendar"
                            maxDate={new Date()}
                            onClickDay={(date) => {
                                if (date > new Date()) {
                                    alert("🌱 The future is unwritten. Start tracking today to build tomorrow’s progress!");
                                }
                            }}
                            onChange={(date) => {
                                handleDateChange(date);
                                setIsCalendarVisible(false);
                            }}
                            value={new Date(selectedDate)}
                        />
                    </div>
                )}
            </div>

            <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ fontSize: '1.2rem', color: '#00ff9d', fontWeight: 'bold' }}>{formatDisplayDate(selectedDate)}</span>
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', color: '#8b949e' }}>Loading logs...</div>
                ) : selectedDate > todayStr ? (
                    <div className="future-state">
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🚀</div>
                        <h2 style={{ color: '#00ff9d', fontWeight: '600', marginBottom: '0.5rem' }}>You are in the present, not the future!</h2>
                        <p style={{ color: '#8b949e' }}>Focus on what you can achieve today.</p>
                    </div>
                ) : (
                    <div className="log-details" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Task Lists */}
                        {[
                            { list: 'java', title: '☕ Java Practice', emoji: '✅' },
                            { list: 'new skill', title: '🚀 New Skill Learning', emoji: '⭐' }
                        ].map(section => (
                            <div key={section.list} className="section-card" style={{ marginBottom: 0 }}>
                                <h3 style={{ color: '#00ff9d', marginBottom: '1rem' }}>{section.title}</h3>
                                {currentLog?.completedTasks?.[section.list]?.tasks?.length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {currentLog.completedTasks[section.list].tasks.map((t, i) => (
                                            <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #30363d', color: '#c9d1d9' }}>
                                                {t.done ? section.emoji : '⏳'} {t.title}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b949e', fontSize: '0.95rem' }}>
                                        <span style={{ opacity: 0.6 }}>○</span>
                                        <span>No activity recorded for this section.</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Coding Challenges */}
                        <div className="section-card" style={{ marginBottom: 0 }}>
                            <h3 style={{ color: '#00ff9d', marginBottom: '1rem' }}>🧠 Coding Challenges</h3>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                {currentLog?.completedTasks?.leetCode?.done && (
                                    <span style={{ color: '#ffa116', fontWeight: 'bold' }}>🧠 LeetCode</span>
                                )}
                                {currentLog?.completedTasks?.gfg?.done && (
                                    <span style={{ color: '#298d46', fontWeight: 'bold' }}>🧠 GFG</span>
                                )}
                                {!currentLog?.completedTasks?.leetCode?.done && !currentLog?.completedTasks?.gfg?.done && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b949e', fontSize: '0.95rem' }}>
                                        <span style={{ opacity: 0.6 }}>○</span>
                                        <span>No coding challenges completed.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="section-card" style={{ marginBottom: 0 }}>
                            <h3 style={{ color: '#00ff9d', marginBottom: '1rem' }}>📝 Notes</h3>
                            {currentLog?.notes ? (
                                <div style={{ color: '#c9d1d9', whiteSpace: 'pre-wrap' }}>{currentLog.notes}</div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b949e', fontSize: '0.95rem' }}>
                                    <span style={{ opacity: 0.6 }}>○</span>
                                    <span>No notes for this day.</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyLogs;
