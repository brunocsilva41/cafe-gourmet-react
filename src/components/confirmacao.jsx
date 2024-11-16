import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/confirmacao.css';
import Header from './Header';

const Confirmacao = ({ pedido }) => {
  const navigate = useNavigate();

  const processarCompra = () => {
    console.log('Processando pedido:', pedido);
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const novoPedido = {
      ...pedido,
      numero: pedidos.length + 1,
      data: new Date().toLocaleDateString(),
      mostrarDetalhes: false,
    };
    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    navigate('/pedidos');
  };

  return (
    <>
      <Header />
      <div className="confirmacao-container">
        <h1>Confirmação de Compra</h1>
        <div className="detalhes-pedido">
          <h2>Detalhes do Pedido</h2>
          <ul>
            {pedido && pedido.itens && pedido.itens.length > 0 ? (
              pedido.itens.map((item, index) => (
                <li key={index}>
                  {item.nome} - {item.quantidade} x R$ {item.preco.toFixed(2)}
                </li>
              ))
            ) : (
              <p>Não há itens no pedido.</p>
            )}
          </ul>
          <p>Total: R$ {pedido ? pedido.total.toFixed(2) : '0.00'}</p>
        </div>
        <button onClick={processarCompra}>Confirmar Compra</button>
      </div>
    </>
  );
};

export default Confirmacao;
