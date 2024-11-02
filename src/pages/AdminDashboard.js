// src/pages/AdminDashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LogsPanel from '../services/LogsPanel';
import UsersPanel from '../services/UsersPanel';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    fetch('http://localhost:3005/admin-dashboard', {
      headers: { Authorization: token },
    })
      .then((res) => {
        if (res.status !== 200) {
          navigate('/login');
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  return (
    <>
      <Header />
      <div>
        <h1>Admin Dashboard</h1>
        <LogsPanel />
        <UsersPanel />
      </div>
    </>
  );
};

export default AdminDashboard;
