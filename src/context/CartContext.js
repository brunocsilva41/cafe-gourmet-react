
import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('carrinho')) || [];
    setCarrinho(savedCart);
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
  }, []);

  const adicionarAoCarrinho = (produto) => {
    const produtoExistente = carrinho.find(item => item.id === produto.id);
    let novoCarrinho;
    if (produtoExistente) {
      novoCarrinho = carrinho.map(item =>
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      );
    } else {
      novoCarrinho = [...carrinho, { ...produto, quantidade: 1 }];
    }
    setCarrinho(novoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    window.dispatchEvent(new Event('storage')); // Atualiza o carrinho em outros componentes
  };

  const removerItem = (index) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);
    setCarrinho(novoCarrinho);
    localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
    window.dispatchEvent(new Event('storage')); // Atualiza o carrinho em outros componentes
  };

  return (
    <CartContext.Provider value={{ carrinho, setCarrinho, adicionarAoCarrinho, removerItem }}>
      {children}
    </CartContext.Provider>
  );
};