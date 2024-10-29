// src/pages/AdminDashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogsPanel from '../services/LogsPanel';
import UsersPanel from '../services/UsersPanel';

const AdminDashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');  // Redireciona se não estiver autenticado
        }
        // Validar token com o backend
        fetch('http://localhost:3005/admin-dashboard', {
            headers: { Authorization: token },
        })
            .then((res) => {
                if (res.status !== 200) {
                    navigate('/login');  // Redireciona se não autorizado
                }
            })
            .catch(() => navigate('/login'));
    }, [navigate]);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <LogsPanel />
            <UsersPanel />
        </div>
    );
};

export default AdminDashboard;
