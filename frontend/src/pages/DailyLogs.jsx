import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API_URL from '../api';

const DailyLogs = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [currentLog, setCurrentLog] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchLogForDate(selectedDate);
    }, [selectedDate]);

    const fetchLogForDate = async (date) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/tasks/${date}`);
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

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d' }}>
                    <Calendar
                        className="dark-theme-calendar"
                        onChange={handleDateChange}
                        value={new Date(selectedDate)}
                    />
                </div>
            </div>

            <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ fontSize: '1.2rem', color: '#00ff9d', fontWeight: 'bold' }}>{selectedDate}</span>
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', color: '#8b949e' }}>Loading logs...</div>
                ) : !currentLog ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#161b22', borderRadius: '8px', border: '1px dashed #30363d' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                        <h3 style={{ color: '#8b949e', fontWeight: '400' }}>No logs available for this date</h3>
                        <p style={{ color: '#484f58', fontSize: '0.9rem' }}>Try selecting another date or log your progress for today!</p>
                    </div>
                ) : (
                    <div className="log-details" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {currentLog.completedTasks?.javaPracticeList?.length > 0 && (
                            <div className="section-card" style={{ marginBottom: 0 }}>
                                <h3 style={{ color: '#00ff9d', marginBottom: '1rem' }}>☕ Java Practice</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {currentLog.completedTasks.javaPracticeList.map((t, i) => (
                                        <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #30363d', color: '#c9d1d9' }}>
                                            {t.done ? '✅' : '⏳'} {t.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {currentLog.notes && (
                            <div className="section-card" style={{ marginBottom: 0 }}>
                                <h3 style={{ color: '#00ff9d', marginBottom: '1rem' }}>📝 Notes</h3>
                                <div style={{ color: '#c9d1d9', whiteSpace: 'pre-wrap' }}>{currentLog.notes}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyLogs;
