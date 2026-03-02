import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const getUser = () => {
        try {
            const data = localStorage.getItem('user');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error parsing user data', e);
            localStorage.removeItem('user');
            return null;
        }
    };
    const user = getUser();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    return (
        <nav className="navbar">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Smart Tracker</div>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/" className="nav-item" onClick={() => setIsDropdownOpen(false)}>
                            <span className="nav-text">Home</span>
                        </Link>
                        <div
                            className="dropdown"
                            onMouseEnter={() => {
                                setIsDropdownOpen(true);
                                document.dispatchEvent(new CustomEvent('close-calendars'));
                            }}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <div className="dropbtn nav-item">
                                <span className="nav-text">Activity</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chevron"><path d="m6 9 6 6 6-6"></path></svg>
                            </div>
                            <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`} style={{ display: isDropdownOpen ? 'block' : 'none' }}>
                                <Link to="/daily-logs" onClick={() => setIsDropdownOpen(false)}>📅 Daily Logs</Link>
                                <Link to="/tracker" onClick={() => setIsDropdownOpen(false)}>🕒 24-Hour Tracker</Link>
                            </div>
                        </div>
                        <a href="#" onClick={handleLogout} className="nav-item" title="Logout">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </a>
                        捉                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
