import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../api';

const TaskItem = ({ title, emoji, field, task, setTask, onSave, customActions = null, isReadOnly }) => {
    const listField = field + "List";
    const tasks = task[listField] || [];
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAddTask = (title = "") => {
        if (isReadOnly) return;
        const newTasks = [...tasks, { title, done: false }];
        setTask({ ...task, [listField]: newTasks });
    };

    const handleUpdateTask = (index, updates) => {
        if (isReadOnly) return;
        const newTasks = [...tasks];
        newTasks[index] = { ...newTasks[index], ...updates };
        setTask({ ...task, [listField]: newTasks });
    };

    const handleRemoveTask = (index) => {
        if (isReadOnly) return;
        const newTasks = tasks.filter((_, i) => i !== index);
        setTask({ ...task, [listField]: newTasks });
    };

    return (
        <div
            className="section-card"
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    if (!isReadOnly && onSave) onSave(true);
                }
            }}
        >
            <div
                className="section-header"
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {emoji} {title}
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#8b949e',
                    transition: 'transform 0.2s',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path>
                    </svg>
                </div>
            </div>

            {isExpanded && (
                <>
                    <div className="tasks-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
                        {tasks.map((t, index) => (
                            <div key={index} className="task-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#161b22', padding: '10px', borderRadius: '6px', border: '1px solid #30363d' }}>
                                <div className="checkbox-container" style={{ margin: 0 }}>
                                    <input
                                        type="checkbox"
                                        checked={t.done || false}
                                        disabled={isReadOnly}
                                        onChange={(e) => handleUpdateTask(index, { done: e.target.checked })}
                                    />
                                </div>
                                <input
                                    type="text"
                                    style={{ flex: 1, backgroundColor: 'transparent', border: 'none', color: 'white', padding: '0' }}
                                    value={t.title || ''}
                                    readOnly={isReadOnly}
                                    placeholder="Describe what you did..."
                                    onChange={(e) => handleUpdateTask(index, { title: e.target.value })}
                                />
                                {!isReadOnly && (
                                    <button
                                        onClick={() => handleRemoveTask(index)}
                                        style={{ background: 'none', border: 'none', color: '#f85149', cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px' }}
                                        title="Remove item"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {!isReadOnly && (
                                <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => handleAddTask("")}>
                                    ➕ Add Manual Task
                                </button>
                            )}
                            {customActions}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const NotesSection = ({ task, setTask, onSave, isReadOnly }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="section-card"
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    if (!isReadOnly && onSave) onSave(true);
                }
            }}
        >
            <div
                className="section-header"
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    📝 Notes / Key Learnings
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#8b949e',
                    transition: 'transform 0.2s',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path>
                    </svg>
                </div>
            </div>

            {isExpanded && (
                <textarea
                    rows="4"
                    placeholder="Add links, commands, ideas, or personal reflections..."
                    readOnly={isReadOnly}
                    value={task.notes || ''}
                    onChange={(e) => setTask({ ...task, notes: e.target.value })}
                ></textarea>
            )}
        </div>
    );
};

const CodingChallengesSection = ({ task, setTask, onSave, isReadOnly }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="section-card"
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    if (!isReadOnly && onSave) onSave(true);
                }
            }}
        >
            <div
                className="section-header"
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    🧠 Coding Challenges
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#8b949e',
                    transition: 'transform 0.2s',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M12.78 6.22a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06 0L3.22 7.28a.75.75 0 011.06-1.06L8 9.94l3.72-3.72a.75.75 0 011.06 0z"></path>
                    </svg>
                </div>
            </div>

            {isExpanded && (
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div className="checkbox-container" style={{ margin: 0 }}>
                            <input
                                type="checkbox"
                                checked={task.leetCodeCompleted || false}
                                disabled={isReadOnly}
                                onChange={(e) => setTask({ ...task, leetCodeCompleted: e.target.checked })}
                            />
                        </div>
                        <button className="btn btn-outline" style={{ fontSize: '0.8rem', borderColor: '#ffa116', color: '#ffa116' }} onClick={() => window.open('https://leetcode.com/problemset/', '_blank')}>LeetCode</button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div className="checkbox-container" style={{ margin: 0 }}>
                            <input
                                type="checkbox"
                                checked={task.gfgCompleted || false}
                                disabled={isReadOnly}
                                onChange={(e) => setTask({ ...task, gfgCompleted: e.target.checked })}
                            />
                        </div>
                        <button className="btn btn-outline" style={{ fontSize: '0.8rem', borderColor: '#298d46', color: '#298d46' }} onClick={() => window.open('https://www.geeksforgeeks.org/problem-of-the-day', '_blank')}>GFG</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DailyLog = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const user = JSON.parse(localStorage.getItem('user')) || { username: 'Guest' };

    const savedSelectedDate = localStorage.getItem('selectedDate') || todayStr;
    const [selectedDate, setSelectedDate] = useState(savedSelectedDate);
    const [task, setTask] = useState({
        date: todayStr,
        leetCodeCompleted: false,
        gfgCompleted: false,
        javaPracticeList: [],
        bookReadingList: [],
        newSkillList: [],
        notes: ''
    });
    const [quote, setQuote] = useState({ text: 'Loading motivation...', author: 'AI' });
    const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error', ''
    const [starVisible, setStarVisible] = useState(false);
    const [starHovered, setStarHovered] = useState(false);
    const statusTimeoutRef = useRef(null);

    const isReadOnly = selectedDate !== todayStr;
    const hasProgress = task.javaPracticeList?.length > 0 ||
        task.bookReadingList?.length > 0 ||
        task.newSkillList?.length > 0 ||
        task.notes || task.leetCodeCompleted || task.gfgCompleted;

    useEffect(() => {
        fetchTask(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        fetchQuote(selectedDate);
    }, [selectedDate]);

    const fetchQuote = async (date) => {
        try {
            const res = await axios.get(`${API_URL}/api/ai/quote?date=${date}`);
            setQuote(res.data);
        } catch (error) {
            console.error("Error fetching quote:", error);
            setQuote({ text: "Success is the ability to go from failure to failure without losing your enthusiasm.", author: "Winston Churchill" });
        }
    };

    const fetchTask = async (date) => {
        try {
            const res = await axios.get(`${API_URL}/api/tasks/${date}`);
            if (res.data.id) {
                setTask(res.data);
            } else {
                resetTaskForDate(date);
            }
        } catch (error) {
            // Task not found for this date
            resetTaskForDate(date);
        }
    };

    const resetTaskForDate = (date) => {
        setTask({
            date: date,
            leetCodeCompleted: false,
            gfgCompleted: false,
            javaPracticeList: [],
            bookReadingList: [],
            newSkillList: [],
            notes: ''
        });
    };

    const handleSave = async (silent = false) => {
        if (silent === true) setSaveStatus('saving');
        try {
            await axios.post(`${API_URL}/api/tasks`, task);
            if (silent === true) {
                setSaveStatus('saved');
                if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
                statusTimeoutRef.current = setTimeout(() => setSaveStatus(''), 2500);
            } else {
                alert("Progress saved successfully! 🚀");
            }
        } catch (error) {
            console.error("Error saving progress:", error);
            if (silent === true) {
                setSaveStatus('error');
            } else {
                alert("Error saving progress.");
            }
        }
    };

    const handleMarkSpecialDay = async () => {
        const title = window.prompt("What makes this day special? (e.g. First Job, Hackathon)");
        if (title && title.trim()) {
            try {
                await axios.post(`${API_URL}/api/special-days`, {
                    date: selectedDate,
                    title: title.trim()
                });
                alert("Successfully marked as a Special Day! ⭐");
            } catch (error) {
                console.error("Error saving special day:", error);
                alert("Failed to save special day");
            }
        }
    };



    return (
        <div className="container">
            <div className="quote-box">
                "{quote.text}"
                <div style={{ fontSize: '0.8rem', color: '#8b949e', marginTop: '0.5rem', fontStyle: 'italic' }}>— {quote.author}</div>
            </div>

            {/* Welcome heading with gradient */}
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <h1 style={{
                    display: 'inline-block',
                    fontSize: 'clamp(1.5rem, 5vw, 2.4rem)',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(90deg, #00ff9d 0%, #00c8ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: '0.5rem 0 0.25rem'
                }}>
                    Welcome back, {user.username}
                </h1>
            </div>

            {/* Date row with ribbon badge */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem', margin: '1rem 0 2rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: '#8b949e' }}>📅</span>
                <span style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', fontWeight: '600', color: '#c9d1d9', letterSpacing: '0.5px' }}>
                    Log for <span style={{ color: '#00ff9d' }}>{selectedDate}</span>
                </span>
                {saveStatus === 'saving' && <span style={{ fontSize: '0.9rem', color: '#58a6ff' }}>⏳</span>}
                {saveStatus === 'saved' && <span style={{ fontSize: '0.9rem', color: '#3fb950' }}>✅</span>}
                {saveStatus === 'error' && <span style={{ fontSize: '0.9rem', color: '#f85149' }}>❌</span>}

                <div
                    onClick={handleMarkSpecialDay}
                    onMouseEnter={() => setStarHovered(true)}
                    onMouseLeave={() => setStarHovered(false)}
                    style={{
                        position: 'absolute',
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        border: `1.5px solid ${starHovered ? '#f0a500' : '#30363d'}`,
                        backgroundColor: starHovered ? 'rgba(240,165,0,0.12)' : 'transparent',
                        color: starHovered ? '#f0a500' : '#484f58',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        transform: starHovered ? 'scale(1.1)' : 'scale(1)',
                        userSelect: 'none',
                        boxShadow: starHovered ? '0 0 12px rgba(240,165,0,0.25)' : 'none'
                    }}
                >
                    ★
                    {starHovered && (
                        <div style={{
                            position: 'absolute',
                            bottom: '110%',
                            right: 0,
                            backgroundColor: '#1c2128',
                            color: '#c9d1d9',
                            fontSize: '0.75rem',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                            border: '1px solid #30363d',
                            pointerEvents: 'none',
                            zIndex: 99
                        }}>
                            Add this day to your favourites
                        </div>
                    )}
                </div>
            </div>

            {isReadOnly && !hasProgress ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    backgroundColor: '#161b22',
                    borderRadius: '8px',
                    border: '1px dashed #30363d',
                    margin: '2rem 0'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏜️</div>
                    <h3 style={{ color: '#8b949e', fontWeight: '400' }}>No progress logged for this day.</h3>
                    <p style={{ color: '#484f58', fontSize: '0.9rem' }}>It looks like you didn't record any activities on {selectedDate}.</p>
                </div>
            ) : (
                <>
                    <CodingChallengesSection
                        task={task}
                        setTask={setTask}
                        onSave={handleSave}
                        isReadOnly={isReadOnly}
                    />

                    <TaskItem
                        title="Java Practice"
                        emoji="☕"
                        field="javaPractice"
                        task={task}
                        setTask={setTask}
                        onSave={handleSave}
                        isReadOnly={isReadOnly}
                    />
                    <TaskItem
                        title="Book Reading"
                        emoji="📚"
                        field="bookReading"
                        task={task}
                        setTask={setTask}
                        onSave={handleSave}
                        isReadOnly={isReadOnly}
                    />

                    <TaskItem
                        title="New Skill Learning"
                        emoji="🚀"
                        field="newSkill"
                        task={task}
                        setTask={setTask}
                        onSave={handleSave}
                        isReadOnly={isReadOnly}
                    />

                    <NotesSection
                        task={task}
                        setTask={setTask}
                        onSave={handleSave}
                        isReadOnly={isReadOnly}
                    />
                </>
            )}

            <div className="save-btn-container">
                {!isReadOnly && <button className="save-btn" onClick={handleSave}>💾 Save My Progress</button>}
                {selectedDate === todayStr && <p style={{ color: '#8b949e', fontStyle: 'italic' }}>Ready for a new day. 🚀</p>}
                {isReadOnly && <p style={{ color: '#8b949e', fontStyle: 'italic' }}>Viewing historical data. This day is locked. 🔒</p>}
            </div>
        </div>
    );
};

export default DailyLog;
