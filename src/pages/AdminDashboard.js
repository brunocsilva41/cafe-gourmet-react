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
      <div className="min-h-screen bg-gray-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-3xl font-bold text-gray-900">Admin Dashboard</div>
        <div className="dashboard">
          <div className="dashboard-menu mb-6 flex space-x-4 items-center">
            <button
              onClick={() => setActivePanel('users')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activePanel === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Usuários
            </button>
            <button
              onClick={() => setActivePanel('logs')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activePanel === 'logs' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Logs
            </button>
          </div>
          <div className="dashboard-content bg-white rounded-lg shadow p-6">
            {activePanel === 'users' && <UsersPanel />}
            {activePanel === 'logs' && <LogsPanel />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
