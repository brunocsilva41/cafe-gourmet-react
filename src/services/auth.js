import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logado = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Sua conta</div>;
};

export default (Logado);
