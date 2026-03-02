import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API_URL from '../api';

const Tracker = () => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [hourlyLog, setHourlyLog] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    useEffect(() => {
        fetchTrackerData(selectedDate);
    }, [selectedDate]);

    const fetchTrackerData = async (date) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/tasks/${date}?userEmail=${user.email}`);
            setHourlyLog(res.data.id ? (res.data.completedTasks?.hourlyLog || {}) : {});
        } catch (error) {
            setHourlyLog({});
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        setSelectedDate(localDate.toISOString().split('T')[0]);
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getHourLabel = (h) => {
        if (h === 0) return "12 AM";
        if (h < 12) return `${h} AM`;
        if (h === 12) return "12 PM";
        return `${h - 12} PM`;
    };

    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#00ff9d' }}>24-Hour Tracker</h1>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button
                    className="premium-toggle-btn"
                    onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                >
                    <span>📅 Choose date: </span>
                    <span style={{ color: '#00ff9d', fontWeight: 'bold', marginLeft: '5px' }}>{selectedDate}</span>
                    <span style={{
                        marginLeft: '10px',
                        transition: 'transform 0.3s',
                        display: 'inline-block',
                        transform: isCalendarVisible ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>▼</span>
                </button>

                {isCalendarVisible && (
                    <div className="premium-calendar-container">
                        <Calendar
                            className="dark-theme-calendar"
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
                <h2 style={{ textAlign: 'center', color: '#8b949e', marginBottom: '2rem' }}>Timeline: {selectedDate}</h2>

                {isLoading ? (
                    <div style={{ textAlign: 'center', color: '#8b949e' }}>Loading timeline...</div>
                ) : selectedDate > todayStr ? (
                    <div className="future-state">
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌱</div>
                        <h3 style={{ color: '#00ff9d', fontWeight: '600', marginBottom: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                            “The future is unwritten. Start tracking today to build tomorrow’s progress!”
                        </h3>
                        <p style={{ color: '#8b949e' }}>Your daily logs for {selectedDate} will appear here once the day arrives.</p>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default Tracker;
