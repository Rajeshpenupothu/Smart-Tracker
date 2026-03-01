import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API_URL from '../api';

const Activity = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialView = queryParams.get('view') || 'logs';

    const [viewMode, setViewMode] = useState(initialView);
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [currentLog, setCurrentLog] = useState(null);
    const [specialDays, setSpecialDays] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(false);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        const view = queryParams.get('view') || 'logs';
        setViewMode(view);
    }, [location.search]);

    useEffect(() => {
        if (viewMode === 'logs' || viewMode === 'tracker') {
            fetchLogForDate(selectedDate);
        } else if (viewMode === 'favorites') {
            fetchSpecialDays();
        }
    }, [viewMode, selectedDate]);

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

    const fetchSpecialDays = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/special-days`);
            setSpecialDays(res.data);
        } catch (error) {
            console.error("Error fetching special days:", error);
        }
    };

    const handleDateChange = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        setSelectedDate(localDate.toISOString().split('T')[0]);
    };

    const renderDailyLogs = () => {
        const hasData = currentLog && (
            currentLog.notes ||
            currentLog.completedTasks?.javaPracticeList?.length > 0 ||
            currentLog.completedTasks?.bookReadingList?.length > 0
        );

        return (
            <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <span style={{ fontSize: '1.2rem', color: '#00ff9d', fontWeight: 'bold' }}>{selectedDate}</span>
                    </div>
                </div>

                {!currentLog ? (
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
        );
    };

    const renderFavorites = () => {
        const filtered = specialDays.filter(sd => {
            const [y, m, d] = sd.date.split('-');
            return parseInt(y) === selectedYear && (parseInt(m) - 1) === selectedMonth;
        });

        return (
            <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        style={{ padding: '8px 12px', background: '#161b22', color: 'white', border: '1px solid #30363d', borderRadius: '4px' }}
                    >
                        {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        style={{ padding: '8px 12px', background: '#161b22', color: 'white', border: '1px solid #30363d', borderRadius: '4px' }}
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                {filtered.length === 0 ? (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#161b22', borderRadius: '8px', border: '1px dashed #30363d' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
                        <h3 style={{ color: '#8b949e', fontWeight: '400' }}>No favorites saved this month</h3>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {filtered.map(sd => (
                            <div key={sd.id} className="section-card" style={{ marginBottom: 0 }}>
                                <div style={{ color: '#00ff9d', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{sd.date}</div>
                                <h3 style={{ color: 'white', marginTop: 0 }}>{sd.title}</h3>
                                <button
                                    onClick={() => {
                                        setSelectedDate(sd.date);
                                        setViewMode('logs');
                                        navigate('/activity?view=logs');
                                    }}
                                    style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#58a6ff', cursor: 'pointer', padding: 0 }}
                                >
                                    View Details ↗
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderTracker = () => {
        const hourlyLog = currentLog?.completedTasks?.hourlyLog || {};
        const hours = Array.from({ length: 24 }, (_, i) => i);

        const getHourLabel = (h) => {
            if (h === 0) return "12 AM";
            if (h < 12) return `${h} AM`;
            if (h === 12) return "12 PM";
            return `${h - 12} PM`;
        };

        return (
            <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
                <h2 style={{ textAlign: 'center', color: '#8b949e', marginBottom: '2rem' }}>24-Hour Timeline: {selectedDate}</h2>
                <div className="timeline">
                    {hours.map(h => (
                        <div key={h} className="timeline-item">
                            <div className="timeline-time">{getHourLabel(h)}</div>
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                {hourlyLog[h] ? hourlyLog[h] : <span style={{ color: '#484f58', fontStyle: 'italic' }}>No activity logged</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#00ff9d' }}>
                {viewMode === 'logs' && 'Daily Logs'}
                {viewMode === 'favorites' && 'Favorites'}
                {viewMode === 'tracker' && '24-Hour Tracker'}
            </h1>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '20px', backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d' }}>
                    <Calendar
                        className="dark-theme-calendar"
                        onChange={handleDateChange}
                        value={new Date(selectedDate)}
                    />
                </div>
            </div>

            {viewMode === 'logs' && renderDailyLogs()}
            {viewMode === 'favorites' && renderFavorites()}
            {viewMode === 'tracker' && renderTracker()}
        </div>
    );
};

export default Activity;
