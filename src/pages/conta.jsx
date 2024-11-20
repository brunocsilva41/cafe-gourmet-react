import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/conta.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getuserId } from '../utils/auth';
import { blobToUrl } from '../utils/blobToUrl';

const Conta = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [userDetails, setUserDetails] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
 

  useEffect(() => {    
    const userId = getuserId();
    console.log('Obtido userId:', userId); // Adicione este log para verificar o userId
    if (!userId) {
      console.error('Erro: userId não encontrado no localStorage.');
      return;
    }
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');

    if (userId && userName && userEmail && role) {
      setUser({ userId, userName, userEmail, role });
    } else {
      console.error('Dados do usuário incompletos no localStorage.');

    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://api-cafe-gourmet.vercel.app/api/user-details/${userId}`);
        const userData = response.data;
        userData.imagem_usuario = blobToUrl(userData.imagem_usuario);
        setUserDetails(userData);
      } catch (error) {
        console.error('Erro ao buscar detalhes do usuário:', error);
      }
    };

    fetchUserDetails();
  }, [setUser]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    console.log('handleImageUpload chamado'); // Adicione este log para verificar se a função está sendo chamada
    const userId = user?.userId || localStorage.getItem('userId'); 
    console.log('Obtido userId para upload:', userId); // Adicione este log para verificar o userId

    if (!userId) {
      console.error('Erro: userId está indefinido.');
      return;
    }

    if (!selectedFile) {
      console.error('Erro: Nenhum arquivo selecionado.');
      return;
    }

    // Verifica se o arquivo selecionado é uma imagem
    if (!selectedFile.type.startsWith('image/')) {
      console.error('Erro: O arquivo selecionado não é uma imagem.');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      console.log('reader.onloadend chamado'); // Adicione este log para verificar se o FileReader está funcionando
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

      try {
        const response = await axios.post(`https://api-cafe-gourmet.vercel.app/api/upload-imagem/${userId}`, { imagem_usuario: base64String }, {
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
          <img src={userDetails.imagem_usuario || user?.userImage} alt="Imagem do Usuário" />
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleImageUpload} disabled={!selectedFile || !user?.userId}>Confirmar Upload</button>
        </div>
        <div className="profile-info">
          <p><strong>Nome:</strong> {user?.userName}</p>
          <p><strong>Email:</strong> {user?.userEmail}</p>
          <p><strong>Data de Criação:</strong> {userDetails.data_criacao}</p>
          <p><strong>Endereço:</strong> {userDetails.endereco}</p>
          <p><strong>Telefone:</strong> {userDetails.telefone_usuario}</p>
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
