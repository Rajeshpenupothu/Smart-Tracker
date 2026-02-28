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
                        <Link to="/activity">Activity</Link>
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
