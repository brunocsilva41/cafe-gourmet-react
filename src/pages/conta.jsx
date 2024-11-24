import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/conta.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getuserId } from '../utils/auth';
import { blobToUrl } from '../utils/blobToUrl';
import { uploadAndSetImage } from '../utils/imageUtils';

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
    const userImage = localStorage.getItem('userImage');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token'); // Adicione esta linha para obter o token

    if (userId && userName && userEmail && role) {
      if (typeof setUser === 'function') {
        setUser({ userId, userName, userEmail, role, userImage });
      } else {
        console.error('Erro: setUser não é uma função.');
      }
    } else {
      console.error('Dados do usuário incompletos no localStorage.');
    }

    if (!token) {
      console.error('Erro: token não encontrado no localStorage.');
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://api-cafe-gourmet.vercel.app/api/user-details/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}` // Adicione o token ao cabeçalho da solicitação
          }
        });
        const userData = response.data;
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

  const handleImageUploadClick = async () => {
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

    try {
      const imageUrl = await uploadAndSetImage(selectedFile, userId);
      console.log('URL da Imagem:', imageUrl);
      // Atualiza a imagem do usuário na tela
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        imagem_usuario: imageUrl,
      }));
      localStorage.setItem('userImage', imageUrl); // Armazena a URL da imagem no localStorage
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error.response ? error.response.data : error.message); // Adicione este log para verificar o erro
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>Perfil do Usuário</h1>
        <div className="profile-image">
          {userDetails.imagem_usuario ? null : <p>Foto não cadastrada</p>}
          {userDetails.imagem_usuario && (
            <img src={blobToUrl(userDetails.imagem_usuario)} alt="Sua Foto" />
          )}
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleImageUploadClick} disabled={!selectedFile || !user?.userId}>Confirmar Upload</button>
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
        </div>
      </div>
    </>
  );
};

export default Conta;