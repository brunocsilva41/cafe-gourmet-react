import React, { useEffect, useState } from 'react';
import '../assets/styles/pedidos.css';
import Header from '../components/Header';
import { obterPedidos } from '../services/pedidoService';
import { getuserId } from '../utils/auth';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      const userId = getuserId();
      if (userId) {
        try {
          console.log(`Buscando pedidos para o userId: ${userId}`);
          const pedidosConfirmados = await obterPedidos(userId);
          console.log('Pedidos recebidos:', pedidosConfirmados);
          setPedidos(pedidosConfirmados);
        } catch (error) {
          console.error('Erro ao obter pedidos:', error);
        }
      } else {
        console.error('userId não está definido.');
      }
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const userId = getuserId();
      if (userId) {
        obterPedidos(userId).then(setPedidos).catch(console.error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleDetalhes = (pedido) => {
    setSelectedPedido(pedido);
  };

  const closePopup = () => {
    setSelectedPedido(null);
  };

  const parseProdutos = (produtos) => {
    return produtos.split(',').map(produto => {
      const [id, nome, quantidade] = produto.split(':');
      return { id, nome, quantidade: Number(quantidade) };
    });
  };

  return (
    <>
      <Header />
      <div className="pedidos-container">
        <h1>Meus Pedidos</h1>
        {pedidos.length > 0 ? (
          pedidos.map((pedido, index) => (
            <div key={index} className="pedido" onClick={() => toggleDetalhes(pedido)}>
              <div className="pedido-header">
                <p>Pedido #{pedido.id}</p>
                <p>Data: {new Date(pedido.data_do_pedido).toLocaleDateString()}</p>
                <p>Total: R$ {typeof pedido.total === 'number' ? pedido.total.toFixed(2) : pedido.total}</p>
                <button>Acompanhar Rastreio</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-pedidos">
            <p>Você não tem pedidos.</p>
          </div>
        )}
      </div>
      {selectedPedido && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes do Pedido #{selectedPedido.id}</h2>
            <ul>
              {parseProdutos(selectedPedido.produtos).map((item, idx) => (
                <li key={idx}>
                  <p>{item.nome}</p>
                  <p>{item.quantidade} x R$ {item.preco ? item.preco.toFixed(2) : '0.00'}</p>
                </li>
              ))}
            </ul>
            <p>Total com Frete: R$ {typeof selectedPedido.totalComFrete === 'number' ? selectedPedido.totalComFrete.toFixed(2) : '0.00'}</p>
            <button onClick={closePopup}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Pedidos;
