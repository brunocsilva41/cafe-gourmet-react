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
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    const userId = user?.userId;

    if (!userId) {
      console.error('Erro: userId está indefinido.');
      return;
    }

    if (!selectedFile) {
      console.error('Erro: Nenhum arquivo selecionado.');
      return;
    }

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
        setUser({ ...user, userImage: reader.result }); // Atualiza a imagem do usuário na tela
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>Perfil do Usuário</h1>
        <div className="profile-image">
          <img src={user?.userImage} alt="Imagem do Usuário" />
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleImageUpload} disabled={!selectedFile}>Confirmar Upload</button>
        </div>
        <div className="profile-info">
          <p><strong>Nome:</strong> {user?.userName}</p>
          <p><strong>Email:</strong> {user?.userEmail}</p>
          <p><strong>Data de Criação:</strong> {userDetails.data_criacao}</p>
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
