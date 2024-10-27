import React, { useEffect, useState } from 'react';
import '../assets/styles/carrinho.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('carrinho')) || [];
    setCart(savedCart);
    setTotal(savedCart.reduce((acc, item) => acc + item.preco, 0));
  }, []);

  const finalizarCompra = () => {
    window.location.href = '/checkout';
  };

  return (
    <main>
      <h2>Seu Carrinho</h2>
      <div id="carrinhoItens" className="cart-items">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.imagem} alt={item.nome} />
            <h3>{item.nome}</h3>
            <p>Preço: R$ {item.preco.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div id="totalCarrinho" className="cart-total">
        <h3>Total: R$ {total.toFixed(2)}</h3>
      </div>
      <button onClick={finalizarCompra}>Finalizar a Compra</button>
    </main>
  );
};

export default Cart;
