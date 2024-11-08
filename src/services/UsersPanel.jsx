// src/components/UsersPanel.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../assets/styles/dashboard.css';


const base_URL = process.env.REACT_APP_BASE_URL;

const UsersPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        axios.get(`http://${base_URL}/usuarios`)
            .then(response => setUsers(response.data))
            .catch(error => console.error('Erro ao carregar usuários:', error));
    }, []);

    const openPopup = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
    };

    const closePopup = () => {
        setSelectedUser(null);
        setNewRole('');
    };

    const handleRoleChange = (event) => {
        setNewRole(event.target.value);
    };

    const updateUser = () => {
        if (selectedUser) {
            axios.put(`http://${base_URL}/usuarios/${selectedUser.Id}`, { role: newRole })
                .then(() => {
                    setUsers(users.map(user => user.Id === selectedUser.Id ? { ...user, role: newRole } : user));
                    alert('Permissão atualizada com sucesso!');
                    closePopup();
                })
                .catch(error => console.error('Erro ao atualizar usuário:', error));
        }
    };

    const deleteUser = (id) => {
        axios.delete(`http://${base_URL}/usuarios/${id}`)
            .then(() => setUsers(users.filter(user => user.Id !== id)))
            .catch(error => console.error('Erro ao deletar usuário:', error));
    };

    return (
        <div>
            <h2>Usuários</h2>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.Id}>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => openPopup(user)}>Alterar Permissão</button>
                                <button onClick={() => deleteUser(user.Id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser && (
                <Popup open={true} closeOnDocumentClick onClose={closePopup}>
                    <div className="modal">
                        <h2>Alterar Permissão</h2>
                        <p>Usuário: {selectedUser.nome}</p>
                        <select value={newRole} onChange={handleRoleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button onClick={updateUser}>Salvar</button>
                        <button onClick={closePopup}>Cancelar</button>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default UsersPanel;
