import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/auth/register`, { username, password });
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            padding: '2rem',
            position: 'relative'
        }}>
            {/* Background glowing orb effect */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(0,255,157,0.15) 0%, rgba(13,17,23,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }}></div>

            <div style={{
                width: '100%',
                maxWidth: '420px',
                backgroundColor: 'rgba(22, 27, 34, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(48, 54, 61, 0.5)',
                borderRadius: '16px',
                padding: '3rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                zIndex: 1
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    background: 'linear-gradient(90deg, #00ff9d 0%, #00b8ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2.5rem',
                    fontWeight: 'bold'
                }}>
                    Create Account
                </h1>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(255, 68, 68, 0.1)',
                        borderLeft: '4px solid #ff4444',
                        padding: '10px',
                        marginBottom: '1.5rem',
                        borderRadius: '4px',
                        color: '#ff4444',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9', fontWeight: '500' }}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: 'rgba(13, 17, 23, 0.8)',
                                border: '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#00ff9d'}
                            onBlur={(e) => e.target.style.borderColor = '#30363d'}
                            placeholder="Choose a username"
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c9d1d9', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: 'rgba(13, 17, 23, 0.8)',
                                border: '1px solid #30363d',
                                borderRadius: '8px',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#00ff9d'}
                            onBlur={(e) => e.target.style.borderColor = '#30363d'}
                            placeholder="Create a password"
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'linear-gradient(90deg, #00ff9d 0%, #00cc7d 100%)',
                            color: '#0d1117',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 14px rgba(0, 255, 157, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 157, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 14px rgba(0, 255, 157, 0.3)';
                        }}
                    >
                        Sign Up
                    </button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '2rem',
                    color: '#8b949e',
                    borderTop: '1px solid #30363d',
                    paddingTop: '1.5rem'
                }}>
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: '#00b8ff',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#00ff9d'}
                        onMouseLeave={(e) => e.target.style.color = '#00b8ff'}
                    >
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
