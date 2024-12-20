import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const base_URL = `https://${process.env.REACT_APP_BASE_URL}`;

export const loginUser = async (email, password, login, navigate, location) => {
  try {
    console.log('Enviando requisição de login para o servidor');
    const url = `${base_URL}/login-conta`;
    console.log('URL de requisição:', url);
    const response = await axios.post(url, { email, password });
    if (response.status === 200) {
      login(response.data);
      localStorage.setItem('userId', response.data.userId); // Armazena o userId no localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.userName);
      localStorage.setItem('userEmail', response.data.userEmail);
      localStorage.setItem('role', response.data.role);
      const from = location.state?.from?.pathname || '/conta';
      navigate(from, { replace: true });
      return response.data;
    } else {
      throw new Error('Falha na autenticação');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
export const useVerificarLogin = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
};

export const isUserLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logoutUser = (logout, navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId'); // Remova o userId do localStorage ao fazer logout
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('role');
  logout();
  navigate('/');
};

export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

export const getuserId = () => {
  const userId = localStorage.getItem('userId');
  console.log('getuserId retornou:', userId);
  return userId;
};
export const getuserEmail = () => {
  const userEmail = localStorage.getItem('userEmail');
  console.log('getuserEmail retornou:', userEmail);
  return userEmail;
};

export const getUserName = () => {
  return localStorage.getItem('userName');
};

export const useAuthLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(logout, navigate);
  };

  return handleLogout;
};
