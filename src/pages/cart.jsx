import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/carrinho.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log('Itens do carrinho:', savedCart); // Adicione este log para depuração
    setCart(savedCart);
    setTotal(savedCart.reduce((acc, item) => acc + Number(item.preco) * item.quantidade, 0));
  }, []);

  const removerItem = (index) => {
    const novoCarrinho = [...cart];
    novoCarrinho.splice(index, 1);
    setCart(novoCarrinho);
    setTotal(novoCarrinho.reduce((acc, item) => acc + Number(item.preco) * item.quantidade, 0));
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
  };

  const finalizarCompra = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Header user={user} />
      <main>
        <h2>Seu Carrinho</h2>
        <div id="carrinhoItens" className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.imagem} alt={item.name} style={{ width: '100px', height: '100px' }} onError={(e) => { e.target.onerror = null; e.target.src = 'default-image-url'; }} />
              <h3>{item.name}</h3>
              <p>Preço: R$ {Number(item.preco).toFixed(2)} x {item.quantidade}</p>
              <button onClick={() => removerItem(index)} className="remove-item-button">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div id="totalCarrinho" className="cart-total">
          <h3>Total: R$ {Number(total).toFixed(2)}</h3>
        </div>
        <button className='checkout' onClick={finalizarCompra}>Finalizar a Compra</button>
      </main>
    </>
  );
};

export default Cart;
