// src/components/UsersPanel.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../assets/styles/dashboard.css';


const base_URL = `https://${process.env.REACT_APP_BASE_URL || 'api-cafe-gourmet.vercel.app'}`;

const UsersPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUserData, setNewUserData] = useState({ role: '', endereco: '', telefone: '' });

    useEffect(() => {
        axios.get(`${base_URL}/usuarios`)
            .then(response => setUsers(response.data))
            .catch(error => console.error('Erro ao carregar usuários:', error));
    }, []);

    const openPopup = (user) => {
        setSelectedUser(user);
        setNewUserData({ role: user.role, endereco: user.endereco, telefone: user.telefone });
    };

    const closePopup = () => {
        setSelectedUser(null);
        setNewUserData({ role: '', endereco: '', telefone: '' });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewUserData(prevState => ({ ...prevState, [name]: value }));
    };

    const updateUser = () => {
        if (selectedUser) {
            axios.put(`${base_URL}/usuarios/${selectedUser.Id}`, newUserData)
                .then(() => {
                    setUsers(users.map(user => user.Id === selectedUser.Id ? { ...user, ...newUserData } : user));
                    alert('Informações atualizadas com sucesso!');
                    closePopup();
                })
                .catch(error => console.error('Erro ao atualizar usuário:', error));
        }
    };

    const deleteUser = (id) => {
        axios.delete(`${base_URL}/usuarios/${id}`)
            .then(() => setUsers(users.filter(user => user.Id !== id)))
            .catch(error => console.error('Erro ao deletar usuário:', error));
    };

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow min-w-full divide-y divide-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Usuários</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.Id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nome}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.endereco}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.telefone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <button onClick={() => openPopup(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Alterar Informações</button>
                                <button onClick={() => deleteUser(user.Id)} className="text-red-600 hover:text-red-900">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser && (
                <Popup open={true} closeOnDocumentClick onClose={closePopup}>
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Alterar Informações</h2>
                            <p className="text-sm text-gray-700 mb-4">Usuário: {selectedUser.nome}</p>
                            <label className="block text-sm font-medium text-gray-700">
                                Role:
                                <select name="role" value={newUserData.role} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50">
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </label>
                            <label className="block text-sm font-medium text-gray-700 mt-4">
                                Endereço:
                                <input type="text" name="endereco" value={newUserData.endereco} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
                            </label>
                            <label className="block text-sm font-medium text-gray-700 mt-4">
                                Telefone:
                                <input type="text" name="telefone" value={newUserData.telefone} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50" />
                            </label>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button onClick={updateUser} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Salvar</button>
                                <button onClick={closePopup} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default UsersPanel;
