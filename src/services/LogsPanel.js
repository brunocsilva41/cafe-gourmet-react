// src/components/LogsPanel.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../assets/styles/dashboard.css';

const LogsPanel = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3005/logs')
            .then(response => setLogs(response.data))
            .catch(error => console.error('Erro ao carregar logs:', error));
    }, []);

    return (
        <div>
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
