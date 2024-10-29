import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/conta.css';

const Conta = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    role: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    navigate('/login'); // Redireciona para a página de login
  };

  useEffect(() => {
    // Obtendo os dados do localStorage
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');

    // Atualizando o estado com os dados do usuário
    if (userId && userName && userEmail && role) {
      setUser({ userId, userName, userEmail, role });
    }
  }, []);

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      <p>ID: {user.userId}</p>
      <p>Nome: {user.userName}</p>
      <p>Email: {user.userEmail}</p>
      <button className='logoff' onClick={handleLogout}>Sair</button>
      {user.role === 'admin' && (
        <button onClick={() => navigate('/admin-dashboard')}>Ir para Admin Dashboard</button>
      )}
    </div>
  );
};

export default Conta;