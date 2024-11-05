import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/conta.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Conta = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
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

    // Fetch orders and payment methods from an API or local storage
    const fetchedOrders = [
      { id: 1, date: '2023-09-01', total: 150.00 },
      { id: 2, date: '2023-08-15', total: 200.00 }
    ];
    const fetchedPaymentMethods = [
      { id: 1, type: 'Credit Card', last4: '1234' },
      { id: 2, type: 'PayPal', email: 'user@example.com' }
    ];

    setOrders(fetchedOrders);
    setPaymentMethods(fetchedPaymentMethods);
  }, [setUser]);

  const handleReorder = (orderId) => {
    console.log(`Reordering order ${orderId}`);
    navigate(`/reorder/${orderId}`);
  };

  const handleAddCard = async () => {
    if (newCard) {
      try {
        const response = await axios.post('/api/add-card', { cardNumber: newCard });
        setPaymentMethods([...paymentMethods, response.data]);
        setNewCard('');
      } catch (error) {
        console.error('Error adding card:', error);
      }
    }
  };

  return (
    <>
      <Header />
      <div>
        <h1>Perfil do Usuário</h1>
        <p>Nome: {user?.userName}</p>
        <p>Email: {user?.userEmail}</p>
        {user?.role === 'admin' && (
          <button onClick={() => navigate('/admin-dashboard')}>Ir para Admin Dashboard</button>
        )}

        <h2>Pedidos Recentes</h2>
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              Pedido #{order.id} - {order.date} - R$ {order.total.toFixed(2)}
              <button onClick={() => handleReorder(order.id)}>Refazer Pedido</button>
            </li>
          ))}
        </ul>

        <h2>Formas de Pagamento</h2>
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
    </>
  );
};

export default Conta;