// src/hooks/useAuthNavigation.js
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useAuthNavigation = () => {
  const navigate = useNavigate();
  const { logout: originalLogout } = useAuth();

  const logout = () => {
    originalLogout();
    navigate('/');
  };

  return { logout };
};

export default useAuthNavigation;