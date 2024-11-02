import React, { useEffect, useState } from 'react';
import '../assets/styles/carrinho.css';
import Header from '../components/Header';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('carrinho')) || [];
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
    window.location.href = '/checkout';
  };

  return (
    <>
      <Header user={user} />
      <main>
        <h2>Seu Carrinho</h2>
        <div id="carrinhoItens" className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.imagem} alt={item.nome} />
              <h3>{item.nome}</h3>
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
