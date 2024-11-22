import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/cartIcon.css';

const CartIcon = ({ carrinho = [], setCarrinho }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setUserName(user.name);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('carrinho')) || [];
      setCarrinho(updatedCart);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setCarrinho]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const totalItems = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const totalPrice = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  const finalizarCompra = () => {
    navigate('/cart');
  };

  const removerItem = (index) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    window.dispatchEvent(new Event('storage')); // Atualiza o carrinho em outros componentes
  };

  return (
    <div className="cart-icon-container">
      <button onClick={toggleCart} className={`cart-button ${isOpen ? 'open' : 'closed'}`}>
        <FaShoppingCart />
        <span className="cart-count">{totalItems}</span>
        {userName && <span className="user-name">{userName}</span>}
      </button>
      {isOpen && (
        <div className="cart-sidebar">
          <button onClick={toggleCart} className="close-cart-button">
            <FaShoppingCart />
          </button>
          <h2>Seu Carrinho</h2>
          {carrinho.length > 0 ? (
            carrinho.map((produto, index) => (
              <div key={index} className="cart-item">
                <img src={produto.imagemUrl} alt={produto.nome} /> {/* Certifique-se de que imagemUrl está correto */}
                <div className="cart-item-details">
                  <h3>{produto.nome}</h3>
                  <p>Preço: R$ {Number(produto.preco).toFixed(2)}</p>
                  <p>Quantidade: {produto.quantidade}</p>
                </div>
                <button onClick={() => removerItem(index)} className="remove-item-button">
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <p>Seu carrinho está vazio.</p>
          )}
          <div className="cart-total">
            <h3>Total: R$ {totalPrice.toFixed(2)}</h3>
          </div>
          <button className="finalizar-compra" onClick={finalizarCompra}>Finalizar Compra</button>
        </div>
      )}
    </div>
  );
};

export default CartIcon;
