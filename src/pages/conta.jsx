import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/conta.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Conta = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newCard, setNewCard] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const role = localStorage.getItem('role');

    if (userId && userName && userEmail && role) {
      setUser({ userId, userName, userEmail, role });
    }

    if (userId) {
      // Fetch payment methods from the backend
      const fetchPaymentMethods = async () => {
        try {
          const response = await axios.get(`/api/metodos-de-pagamento/${userId}`);
          setPaymentMethods(response.data);
        } catch (error) {
          console.error('Erro ao buscar métodos de pagamento:', error);
        }
      };

      fetchPaymentMethods();
    }
  }, [setUser]);

  const handleAddCard = async () => {
    if (newCard && user?.userId) {
      try {
        const response = await axios.post(`/api/add-metodos-de-pagamento/${user.userId}`, { metodo: newCard });
        setPaymentMethods([...paymentMethods, { id: response.data.id, type: 'Credit Card', last4: newCard.slice(-4) }]);
        setNewCard('');
      } catch (error) {
        console.error('Erro ao adicionar método de pagamento:', error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>Perfil do Usuário</h1>
        <div className="profile-info">
          <p><strong>Nome:</strong> {user?.userName}</p>
          <p><strong>Email:</strong> {user?.userEmail}</p>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin-dashboard')}>Ir para Admin Dashboard</button>
          )}
        </div>

        <h2>Formas de Pagamento</h2>
        <div className="payment-methods-container">
          <ul>
            {paymentMethods.map(method => (
              <li key={method.id}>
                {method.type} - {method.type === 'Credit Card' ? `**** **** **** ${method.last4}` : method.email}
              </li>
            ))}
          </ul>
          <input 
            type="text" 
            value={newCard} 
            onChange={(e) => setNewCard(e.target.value)} 
            placeholder="Número do Cartão" 
          />
          <button onClick={handleAddCard}>Adicionar Cartão</button>
        </div>
      </div>
    </>
  );
};

export default Conta;