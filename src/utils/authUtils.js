import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export const loginUser = async (email, password, login, navigate, location) => {
  try {
    console.log('Enviando requisição de login para o servidor');
    const response = await axios.post('http://localhost:3005/login-conta', { email, password });
    if (response.status === 200) {
      login(response.data);
      localStorage.setItem('token', response.data.token);
      const from = location.state?.from?.pathname || '/conta';
      navigate(from, { replace: true });
    } else {
      throw new Error('Falha na autenticação');
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
