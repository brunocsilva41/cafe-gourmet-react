// src/pages/AdminDashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import LogsPanel from '../services/LogsPanel';
import UsersPanel from '../services/UsersPanel';
import { isAdmin } from '../utils/authUtils';

const base_URL = `https://${process.env.REACT_APP_BASE_URL}`;


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !isAdmin(user)) {
      navigate('/login');
      return;
    }
    fetch(`${base_URL}/admin-dashboard`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (res.status !== 200) {
          navigate('/login');
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate, user]);

  return (
    <>
      <Header />
      <div>
        <h1>Admin Dashboard</h1>
        <UsersPanel />
        <div>
          <LogsPanel />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
