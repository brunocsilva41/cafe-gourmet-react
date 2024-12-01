import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa'; // Importar ícone de lápis
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert
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
  const [showRefreshMessage, setShowRefreshMessage] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false); // Estado para controlar o popup de edição
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatedDetails, setUpdatedDetails] = useState({
    userName: '',
    userEmail: '',
    endereco: '',
    telefone_usuario: ''
  });

  useEffect(() => {    
    const userId = getuserId();
    console.log('Obtido userId:', userId); 
    
    if (!userId) {
      console.error('Erro: userId não encontrado no localStorage.');
      return;
    }
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userImage = localStorage.getItem('userImage');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token'); 

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
            Authorization: `Bearer ${token}` 
          }
        });
        const userData = response.data;
        setUserDetails(userData);
        setUpdatedDetails({
          userName: userData.userName,
          userEmail: userData.userEmail,
          endereco: userData.endereco,
          telefone_usuario: userData.telefone_usuario
        });
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
    console.log('handleImageUpload chamado'); 
    const userId = user?.userId || localStorage.getItem('userId'); 
    console.log('Obtido userId para upload:', userId); 

    if (!userId) {
      console.error('Erro: userId está indefinido.');
      return;
    }

    if (!selectedFile) {
      console.error('Erro: Nenhum arquivo selecionado.');
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      console.error('Erro: O arquivo selecionado não é uma imagem.');
      return;
    }

    try {
      const imageUrl = await uploadAndSetImage(selectedFile, userId);
      console.log('URL da Imagem:', imageUrl);
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        imagem_usuario: imageUrl,
      }));
      localStorage.setItem('userImage', imageUrl); 
      setShowRefreshMessage(true); 
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error.response ? error.response.data : error.message); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    const userId = user?.userId || localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const updatedData = {
      Id: userId,
      nome: updatedDetails.userName,
      email: updatedDetails.userEmail,
      role: user?.role,
      endereco: updatedDetails.endereco,
      telefone_usuario: updatedDetails.telefone_usuario
    };

    try {
      console.log('Dados enviados para atualização:', updatedData);
      await axios.put('https://api-cafe-gourmet.vercel.app/editar-cadastro', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserDetails((prevDetails) => ({
        ...updatedDetails,
        imagem_usuario: prevDetails.imagem_usuario // Manter a URL da imagem
      }));
      Swal.fire('Sucesso', 'Informações atualizadas com sucesso!', 'success');
      setShowEditPopup(false); // Fechar popup após salvar alterações
    } catch (error) {
      console.error('Erro ao atualizar informações:', error);
      if (error.response) {
        console.error('Detalhes do erro:', error.response.data);
        Swal.fire('Erro', `Erro ao atualizar informações: ${error.response.data.message || 'Erro desconhecido'}`, 'error');
      } else {
        Swal.fire('Erro', 'Erro ao atualizar informações. Por favor, tente novamente mais tarde.', 'error');
      }
    }
  };

  const handlePasswordReset = async () => {
    const userId = user?.userId || localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`https://api-cafe-gourmet.vercel.app/api/reset-password`, {
        userId,
        currentPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        Swal.fire('Sucesso', 'Senha alterada com sucesso!', 'success');
        setShowPasswordReset(false);
      } else {
        Swal.fire('Erro', 'Erro ao alterar a senha. Verifique a senha atual e tente novamente.', 'error');
      }
    } catch (error) {
      console.error('Erro ao alterar a senha:', error);
      Swal.fire('Erro', 'Erro ao alterar a senha. Por favor, tente novamente mais tarde.', 'error');
    }
  };

  const deleteUserAccount = async () => {
    const userId = user?.userId || localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (window.confirm('Tem certeza que deseja excluir sua conta?')) {
        try {
            await axios.delete(`https://api-cafe-gourmet.vercel.app/usuarios/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            Swal.fire('Sucesso', 'Conta excluída com sucesso!', 'success' );
            navigate('/'); // Redirecionar para a página inicial após a exclusão
        } catch (error) {
            console.error('Erro ao excluir conta:', error);
            Swal.fire('Erro', 'Erro ao excluir conta. Por favor, tente novamente mais tarde.', 'error');
        }
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
          {showRefreshMessage && <p>Atualize a página para carregar a foto.</p>}
        </div>
        <div className="profile-info">
          <p><strong>Nome:</strong> {userDetails.userName || user?.userName} </p>
          <p><strong>Email:</strong> {userDetails.userEmail || user?.userEmail} </p>
          <p><strong>Endereço:</strong> {userDetails.endereco} </p>
          <p><strong>Telefone:</strong> {userDetails.telefone_usuario} </p>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin-dashboard')}>Ir para Admin Dashboard</button>
          )}
          <button onClick={() => setShowPasswordReset(true)}>Redefinir Senha</button>
          <button onClick={() => setShowEditPopup(true)}><FaEdit /> Editar Informações</button>
          <button onClick={deleteUserAccount}>Excluir Conta</button>
        </div>
      </div>
      {showEditPopup && (
        <div className="edit-popup">
          <h2>Editar Informações</h2>
          <label>
            Nome:
            <input type="text" name="userName" value={updatedDetails.userName  || user?.userName} onChange={handleInputChange} />
          </label>
          <label>
            Email:
            <input type="email" name="userEmail" value={updatedDetails.userEmail || user?.userEmail} onChange={handleInputChange} />
          </label>
          <label>
            Endereço:
            <input type="text" name="endereco" value={updatedDetails.endereco} onChange={handleInputChange} />
          </label>
          <label>
            Telefone:
            <input type="text" name="telefone_usuario" value={updatedDetails.telefone_usuario} onChange={handleInputChange} />
          </label>
          <button onClick={handleSaveChanges}>Salvar Alterações</button>
          <button onClick={() => setShowEditPopup(false)}>Cancelar</button>
        </div>
      )}
      {showPasswordReset && (
        <div className="password-reset-popup">
          <h2>Redefinir Senha</h2>
          <label>
            Senha Atual:
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </label>
          <label>
            Nova Senha:
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </label>
          <button onClick={handlePasswordReset}>Confirmar</button>
          <button onClick={() => setShowPasswordReset(false)}>Cancelar</button>
        </div>
      )}
    </>
  );
};

export default Conta;