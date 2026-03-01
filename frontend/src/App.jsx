import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DailyLog from './components/DailyLog';
import Activity from './pages/Activity';
import Login from './pages/Login';
import Register from './pages/Register';

import axios from 'axios';
import API_URL from './api';

const PrivateRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
};

function App() {
  // Add a background heartbeat to keep the Render backend alive
  React.useEffect(() => {
    const pingBackend = async () => {
      try {
        await axios.get(`${API_URL}/health`);
        console.log('[Heartbeat] Backend ping successful');
      } catch (err) {
        console.warn('[Heartbeat] Backend ping failed');
      }
    };

    // Ping immediately on load
    pingBackend();

    // Ping every 10 minutes
    const interval = setInterval(pingBackend, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <DailyLog />
          </PrivateRoute>
        } />
        <Route path="/activity" element={
          <PrivateRoute>
            <Activity />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
