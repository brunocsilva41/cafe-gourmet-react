import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/styles/confirmacao.css';
import { criarPedido } from '../services/pedidoService';
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

  const processarCompra = async () => {
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
    window.dispatchEvent(new Event('storage')); // Atualiza o carrinho em outros componentes

    try {
      await criarPedido({
        userId: 1, // Substitua pelo ID do usuário real
        produtos: pedido.itens.map(item => ({
          nome: item.nome,
          preco: item.preco,
          quantidade: item.quantidade
        })),
        total: pedido.total
      });
      alert('Pedido efetuado com sucesso!');
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao criar pedido. Tente novamente.');
    }
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
                  <img src={item.imagemUrl} alt={item.nome} /> {/* Adicionar imagem */}
                  <div>
                    <h3>{item.nome}</h3> {/* Adicionar nome do produto */}
                    <p>{item.quantidade} x R$ {parseFloat(item.preco).toFixed(2)}</p>
                  </div>
                </li>
              ))
            ) : (
              <p>Não há itens no pedido.</p>
            )}
          </ul>
          <p>Total: R$ {pedido ? parseFloat(pedido.total).toFixed(2) : '0.00'}</p>
        </div>
        <button onClick={processarCompra}>Confirmar Compra</button>
      </div>
    </>
  );
};

export default Confirmacao;
