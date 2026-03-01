import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API_URL from '../api';

const Tracker = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [hourlyLog, setHourlyLog] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTrackerData(selectedDate);
    }, [selectedDate]);

    const fetchTrackerData = async (date) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/tasks/${date}`);
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
                <h2 style={{ textAlign: 'center', color: '#8b949e', marginBottom: '2rem' }}>Timeline: {selectedDate}</h2>

                {isLoading ? (
                    <div style={{ textAlign: 'center', color: '#8b949e' }}>Loading timeline...</div>
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
