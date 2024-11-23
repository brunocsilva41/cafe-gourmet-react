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
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Logs de Requisições</h2>
            <ul className="divide-y divide-gray-200">
                {logs.map((log, index) => (
                    <li key={index} className="py-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                            log.method === 'POST' ? 'bg-green-100 text-green-800' :
                            log.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {log.method}
                        </span>
                        <span className="ml-4">{log.timestamp} - {log.path} - Status: {log.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LogsPanel;
