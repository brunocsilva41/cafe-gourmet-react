import React, { useEffect, useState } from 'react';
import '../assets/styles/pedidos.css';
import Header from '../components/Header';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const pedidosConfirmados = JSON.parse(localStorage.getItem('pedidos')) || [];
    setPedidos(pedidosConfirmados);
  }, []);

  const toggleDetalhes = (index) => {
    const novosPedidos = [...pedidos];
    novosPedidos[index].mostrarDetalhes = !novosPedidos[index].mostrarDetalhes;
    setPedidos(novosPedidos);
  };

  const removerPedido = (index) => {
    const novosPedidos = pedidos.filter((_, i) => i !== index);
    setPedidos(novosPedidos);
    localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
  };

  return (
    <>
      <Header />
      <div className="pedidos-container">
        <h1>Meus Pedidos</h1>
        {pedidos.length > 0 ? (
          pedidos.map((pedido, index) => (
            <div key={index} className="pedido">
              <div className="pedido-header" onClick={() => toggleDetalhes(index)}>
                <p>Pedido #{pedido.numero}</p>
                <p>Data: {pedido.data}</p>
                <p>Total: R$ {pedido.total.toFixed(2)}</p>
                <button>Acompanhar Rastreio</button>
                <button onClick={() => removerPedido(index)}>Remover Pedido</button>
              </div>
              {pedido.mostrarDetalhes && (
                <div className="pedido-detalhes">
                  <ul>
                    {pedido.itens.map((item, idx) => (
                      <li key={idx}>
                        <img src={item.foto} alt={item.nome} />
                        <p>{item.nome}</p>
                        <p>{item.quantidade} x R$ {item.preco.toFixed(2)}</p>
                      </li>
                    ))}
                  </ul>
                  <p>Total com Frete: R$ {pedido.totalComFrete.toFixed(2)}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Você não tem pedidos.</p>
        )}
      </div>
    </>
  );
};

export default Pedidos;
