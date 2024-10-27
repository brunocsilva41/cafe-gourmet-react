import React from 'react';
import '../assets/styles/checkout.css';

const Products = () => {
  const produtos = [
    { nome: 'Café Gourmet 1', preco: 20.0, imagem: '../css/imagens/cafe1.jpg' },
    { nome: 'Café Gourmet 2', preco: 25.0, imagem: '../css/imagens/cafe2.jpg' },
    // Adicione mais produtos conforme necessário
  ];

  const adicionarAoCarrinho = (produto) => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  };

  return (
    <main>
      <h2>Produtos</h2>
      <div className="product-list">
        {produtos.map((produto, index) => (
          <div key={index} className="product-item">
            <img src={produto.imagem} alt={produto.nome} />
            <h3>{produto.nome}</h3>
            <p>R$ {produto.preco.toFixed(2)}</p>
            <button onClick={() => adicionarAoCarrinho(produto)}>Adicionar ao Carrinho</button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Products;
