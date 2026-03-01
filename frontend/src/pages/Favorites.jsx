import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';

const Favorites = () => {
    const navigate = useNavigate();
    const [specialDays, setSpecialDays] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    useEffect(() => {
        fetchSpecialDays();
    }, []);

    const fetchSpecialDays = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/special-days`);
            setSpecialDays(res.data);
        } catch (error) {
            console.error("Error fetching special days:", error);
        }
    };

    const handleJumpToLog = (dateString) => {
        localStorage.setItem('selectedDate', dateString);
        navigate('/daily-logs');
    };

    const filtered = specialDays.filter(sd => {
        const [y, m, d] = sd.date.split('-');
        return parseInt(y) === selectedYear && (parseInt(m) - 1) === selectedMonth;
    });

    return (
        <div className="container">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#00ff9d' }}>Favorites</h1>

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
                    <p style={{ color: '#484f58', fontSize: '0.9rem' }}>Go to your daily log and click the star to add a favorite!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map(sd => (
                        <div key={sd.id} className="section-card" style={{ marginBottom: 0 }}>
                            <div style={{ color: '#00ff9d', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{sd.date}</div>
                            <h3 style={{ color: 'white', marginTop: 0 }}>{sd.title}</h3>
                            <button
                                onClick={() => handleJumpToLog(sd.date)}
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

export default Favorites;
