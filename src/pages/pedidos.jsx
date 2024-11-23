import React, { useEffect, useState } from 'react';
import '../assets/styles/pedidos.css';
import Header from '../components/Header';
import { obterPedidos } from '../services/pedidoService';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const pedidosConfirmados = await obterPedidos();
        setPedidos(pedidosConfirmados);
      } catch (error) {
        console.error('Erro ao obter pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  const toggleDetalhes = (pedido) => {
    setSelectedPedido(pedido);
  };

  const closePopup = () => {
    setSelectedPedido(null);
  };

  const removerPedido = (index) => {
    const novosPedidos = pedidos.filter((_, i) => i !== index);
    setPedidos(novosPedidos);
    // Atualizar o banco de dados conforme necessário
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
                <p>Pedido #{pedido.numero}</p>
                <p>Data: {pedido.data}</p>
                <p>Total: R$ {pedido.total ? pedido.total.toFixed(2) : '0.00'}</p>
                <button>Acompanhar Rastreio</button>
                <button onClick={() => removerPedido(index)}>Remover Pedido</button>
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
            <h2>Detalhes do Pedido #{selectedPedido.numero}</h2>
            <ul>
              {selectedPedido.itens.map((item, idx) => (
                <li key={idx}>
                  <img src={item.foto} alt={item.nome} className="item-thumbnail" />
                  <p>{item.nome}</p>
                  <p>{item.quantidade} x R$ {item.preco.toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <p>Total com Frete: R$ {selectedPedido.totalComFrete ? selectedPedido.totalComFrete.toFixed(2) : '0.00'}</p>
            <button onClick={closePopup}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Pedidos;
