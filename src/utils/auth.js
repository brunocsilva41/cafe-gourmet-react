import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuthLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    logout();
    navigate('/');
  };

  return handleLogout;
};
