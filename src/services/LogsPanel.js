// src/components/LogsPanel.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../assets/styles/dashboard.css';

const base_URL = process.env.REACT_APP_BASE_URL || 'api-cafe-gourmet.vercel.app';

const LogsPanel = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get(`https://${base_URL}/logs`)
            .then(response => setLogs(response.data))
            .catch(error => console.error('Erro ao carregar logs:', error));
    }, []);

    return (
        <div className="panel">
            <h2>Logs de Requisições</h2>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>
                        {log.timestamp} - {log.method} {log.path} - Status: {log.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LogsPanel;
