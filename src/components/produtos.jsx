import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../assets/styles/produtos.css';

const Products = () => {
  const [produtos, setProdutos] = useState([]);
  const [filtro, setFiltro] = useState({
    tipo: '',
    ordenar: '',
    precoMin: '',
    precoMax: ''
  });

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://localhost:3005/api/produtos');
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro({ ...filtro, [name]: value });
  };

  const adicionarAoCarrinho = (produto) => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  };

  const produtosFiltrados = produtos
    .filter(produto => 
      (filtro.tipo ? produto.categoria === filtro.tipo : true) &&
      (filtro.precoMin ? produto.preco >= filtro.precoMin : true) &&
      (filtro.precoMax ? produto.preco <= filtro.precoMax : true)
    )
    .sort((a, b) => {
      if (filtro.ordenar === 'preco-asc') return a.preco - b.preco;
      if (filtro.ordenar === 'preco-desc') return b.preco - a.preco;
      return 0;
    });

  return (
    <>
      <main>
        <h2>Produtos</h2>
        <div className="filter">
          <select name="tipo" onChange={handleFiltroChange}>
            <option value="">Todos os Tipos</option>
            <option value="tipo1">Tipo 1</option>
            <option value="tipo2">Tipo 2</option>
            {/* Adicione mais opções conforme necessário */}
          </select>
          <select name="ordenar" onChange={handleFiltroChange}>
            <option value="">Ordenar</option>
            <option value="preco-asc">Preço: Menor para Maior</option>
            <option value="preco-desc">Preço: Maior para Menor</option>
          </select>
          <input
            type="number"
            name="precoMin"
            placeholder="Preço Mínimo"
            onChange={handleFiltroChange}
          />
          <input
            type="number"
            name="precoMax"
            placeholder="Preço Máximo"
            onChange={handleFiltroChange}
          />
        </div>
        <div className="product-list">
          {produtosFiltrados.map((produto, index) => (
            <div key={index} className="product-item">
              <img src={produto.imagem} alt={produto.name} />
              <h3>{produto.name}</h3>
              <p>R$ {produto.preco.toFixed(2)}</p>
              <button onClick={() => adicionarAoCarrinho(produto)}>Adicionar ao Carrinho</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Products;