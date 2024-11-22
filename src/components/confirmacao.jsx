import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/confirmacao.css';
import Header from './Header';

const Confirmacao = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pedido } = location.state || {};

  useEffect(() => {
    if (!pedido) {
      navigate('/');
    }
  }, [pedido, navigate]);

  const processarCompra = () => {
    console.log('Processando pedido:', pedido);
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const novoPedido = {
      ...pedido,
      numero: Math.floor(Math.random() * 1000000), // Gerar número aleatório
      data: new Date().toLocaleDateString(),
      mostrarDetalhes: false,
    };
    pedidos.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    localStorage.removeItem('carrinho');
    alert('Pedido efetuado com sucesso!');
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
                  {item.nome} - {item.quantidade} x R$ {parseFloat(item.preco).toFixed(2)}
                  <img src={item.imagemUrl} alt={item.nome} /> {/* Adicionar imagem */}
                  {item.nome} - {item.quantidade} x R$ {parseFloat(item.preco).toFixed(2)}
                </li>
              ))
            ) : (
              <p>Não há itens no pedido.</p>
            )}
          </ul>
          <p>Total: R$ {pedido ? parseFloat(pedido.total).toFixed(2) : '0.00'}</p>
          <p>Total: R$ {pedido ? parseFloat(pedido.total).toFixed(2) : '0.00'}</p>
        </div>
        <button onClick={processarCompra}>Confirmar Compra</button>
      </div>
    </>
  );
};

export default Confirmacao;
