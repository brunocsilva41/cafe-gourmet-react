import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/conta.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Conta = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [tipo, setTipo] = useState('');
  const [detalhes, setDetalhes] = useState({});
  const [metodosPagamento, setMetodosPagamento] = useState([]);

  useEffect(() => {
    const userId = user?.userId;
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
          const { data } = response.data;
          setMetodosPagamento(data);
        } catch (error) {
          console.error('Erro ao buscar métodos de pagamento:', error);
        }
      };

      fetchPaymentMethods();
    }
  }, [setUser, user]);

  const adicionarMetodo = async () => {
    const userId = user?.userId;
    if (tipo && detalhes && userId) {
      try {
        let detalhesConcatenados = '';
        if (tipo === 'cartao_credito') {
          detalhesConcatenados = `${detalhes.numero_cartao};${detalhes.validade};${detalhes.cvv}`;
        } else if (tipo === 'pix') {
          detalhesConcatenados = detalhes.chave_pix;
        }

        console.log('Enviando detalhes:', { tipo, detalhes: detalhesConcatenados });

        const response = await axios.post(`/api/add-metodos-de-pagamento/${userId}`, {
          tipo,
          detalhes: detalhesConcatenados,
        });
        alert(response.data.message);
        setTipo('');
        setDetalhes({});
        // Recarregar métodos de pagamento
        const fetchPaymentMethods = async () => {
          try {
            const response = await axios.get(`/api/metodos-de-pagamento/${userId}`);
            const { data } = response.data;
            setMetodosPagamento(data);
          } catch (error) {
            console.error('Erro ao buscar métodos de pagamento:', error);
          }
        };
        await fetchPaymentMethods();
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
        <h3>Métodos de Pagamento</h3>
        <ul>
          {metodosPagamento.map((metodo, index) => (
            <li key={index}>{metodo.tipo}: {metodo.detalhes}</li>
          ))}
        </ul>
        <h3>Adicionar Método de Pagamento</h3>
        <select onChange={(e) => setTipo(e.target.value)} value={tipo}>
          <option value="">Selecione o tipo</option>
          <option value="cartao_credito">Cartão de Crédito</option>
          <option value="pix">Pix</option>
        </select>

        {tipo === 'cartao_credito' && (
          <>
            <input
              type="text"
              placeholder="Número do Cartão"
              onChange={(e) =>
                setDetalhes({ ...detalhes, numero_cartao: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Validade"
              onChange={(e) =>
                setDetalhes({ ...detalhes, validade: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="CVV"
              onChange={(e) =>
                setDetalhes({ ...detalhes, cvv: e.target.value })
              }
            />
          </>
        )}
        {tipo === 'pix' && (
          <input
            type="text"
            placeholder="Chave Pix"
            onChange={(e) =>
              setDetalhes({ ...detalhes, chave_pix: e.target.value })
            }
          />
        )}
        <button onClick={adicionarMetodo}>Adicionar</button>
      </div>
    </>
  );
};

export default Conta;
