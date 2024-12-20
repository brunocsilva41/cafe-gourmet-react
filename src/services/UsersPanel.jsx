// src/components/UsersPanel.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Swal from 'sweetalert2'; // Importar SweetAlert
import '../assets/styles/dashboard.css';


const base_URL = `https://${process.env.REACT_APP_BASE_URL || 'api-cafe-gourmet.vercel.app'}`;

const UsersPanel = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUserData, setNewUserData] = useState({ nome: '', role: '', endereco: '', telefone: '' });

    useEffect(() => {
        axios.get(`${base_URL}/usuarios`)
            .then(response => setUsers(response.data))
            .catch(error => console.error('Erro ao carregar usuários:', error));
    }, []);

    const openPopup = (user) => {
        setSelectedUser(user);
        setNewUserData({ nome: user.nome, role: user.role, endereco: user.endereco, telefone: user.telefone_usuario });
    };

    const closePopup = () => {
        setSelectedUser(null);
        setNewUserData({ nome: '', role: '', endereco: '', telefone: '' });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewUserData(prevState => ({ ...prevState, [name]: value }));
    };

    const updateUser = () => {
        if (selectedUser) {
            const updatedUserData = {
                Id: selectedUser.Id,
                name: newUserData.nome,
                email: selectedUser.email,
                role: newUserData.role,
                endereco: newUserData.endereco,
                telefone_usuario: newUserData.telefone
            };

            axios.put(`${base_URL}/usuarios/${selectedUser.Id}`, updatedUserData)
                .then(() => {
                    setUsers(users.map(user => user.Id === selectedUser.Id ? { ...user, ...updatedUserData } : user));
                    Swal.fire('Sucesso', 'Informações atualizadas com sucesso!', 'success');
                    closePopup();
                })
                .catch(error => console.error('Erro ao atualizar usuário:', error));
        }
    };

    const deleteUser = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            axios.delete(`${base_URL}/usuarios/${id}`)
                .then(() => {
                    setUsers(users.filter(user => user.Id !== id));
                    Swal.fire('Sucesso', 'Usuário excluído com sucesso!', 'success');
                })
                .catch(error => console.error('Erro ao deletar usuário:', error));
        }
    };

    return (
        <div className="panel">
            <h2>Usuários</h2>
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Endereço</th>
                        <th>Telefone</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.Id}>
                            <td>{user.nome}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.endereco}</td>
                            <td>{user.telefone_usuario}</td>
                            <td>
                                <button onClick={() => openPopup(user)}>Alterar Informações</button>
                                <button onClick={() => deleteUser(user.Id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedUser && (
                <Popup open={true} closeOnDocumentClick onClose={closePopup}>
                    <div className="modal">
                        <h2>Alterar Informações</h2>
                        <label>
                            Usuário:
                            <input type="text" name="nome" value={newUserData.nome} onChange={handleInputChange} />
                        </label>
                        <label>
                            Role:
                            <select name="role" value={newUserData.role} onChange={handleInputChange}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </label>
                        <label>
                            Endereço:
                            <input type="text" name="endereco" value={newUserData.endereco} onChange={handleInputChange} />
                        </label>
                        <label>
                            Telefone:
                            <input type="text" name="telefone" value={newUserData.telefone} onChange={handleInputChange} />
                        </label>
                        <button onClick={updateUser}>Salvar</button>
                        <button onClick={closePopup}>Cancelar</button>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default UsersPanel;
