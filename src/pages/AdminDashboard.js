// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import LogsPanel from '../services/LogsPanel';
import UsersPanel from '../services/UsersPanel';
import { isAdmin } from '../utils/authUtils';

const base_URL = `https://${process.env.REACT_APP_BASE_URL || 'api-cafe-gourmet.vercel.app'}`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activePanel, setActivePanel] = useState('users');

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
      <div className='conteudo'>
      <div className='dashboard'>
        <div className='dashboard-menu'>
          <button onClick={() => setActivePanel('users')}>Usuários</button>
          <button onClick={() => setActivePanel('logs')}>Logs</button>
        </div>
        <div className='dashboard-content'>
          {activePanel === 'users' && <UsersPanel />}
          {activePanel === 'logs' && <LogsPanel />}
        </div>
      </div>
      </div>
    </>
  );
};

export default AdminDashboard;
