import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Smart Tracker</div>
            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/">Home</Link>
                        <div className="dropdown">
                            <Link to="/activity" className="dropbtn">Activity</Link>
                            <div className="dropdown-content">
                                <Link to="/activity?view=logs">Daily Logs</Link>
                                <Link to="/activity?view=favorites">Favorites</Link>
                                <Link to="/activity?view=tracker">24-Hour Tracker</Link>
                            </div>
                        </div>
                        <a href="#" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
                    </>
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
