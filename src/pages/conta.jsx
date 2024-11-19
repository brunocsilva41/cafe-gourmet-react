import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/conta.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Conta = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const userId = user?.userId;
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');

    if (userId && userName && userEmail && role) {
      setUser({ userId, userName, userEmail, role });
    }

    if (userId) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`/api/user-details/${userId}`);
          setUserDetails(response.data);
        } catch (error) {
          console.error('Erro ao buscar detalhes do usuário:', error);
        }
      };

      fetchUserDetails();
    }
  }, [setUser, user]);

  const handleImageUpload = async (e) => {
    const userId = user?.userId;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

      try {
        const response = await axios.post(`/api/upload-imagem/${userId}`, { imagem_usuario: base64String }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert(response.data.message);
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>Perfil do Usuário</h1>
        <div className="profile-image">
          <img src={user?.userImage} alt="Imagem do Usuário" />
          <input type="file" onChange={handleImageUpload} />
        </div>
        <div className="profile-info">
          <p><strong>Nome:</strong> {user?.userName}</p>
          <p><strong>Email:</strong> {user?.userEmail}</p>
          <p><strong>Data de Criação:</strong> {userDetails.createdAt}</p>
          <p><strong>Endereço:</strong> {userDetails.address}</p>
          <p><strong>Telefone:</strong> {userDetails.phone}</p>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin-dashboard')}>Ir para Admin Dashboard</button>
          )}
          <button onClick={() => navigate('/edit-profile')}>Editar Perfil</button>
        </div>
      </div>
    </>
  );
};

export default Conta;
