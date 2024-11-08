import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/produtos.css'; // Importa o CSS para estilizar os produtos
import CartIcon from '../components/CartIcon';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { blobToUrl } from '../utils/blobToUrl';


const base_URL = process.env.BASE_URL;


const Products = () => {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState({
    tipo: '',
    ordenar: '',
    precoMin: '',
    precoMax: ''
  });
  const [carrinho, setCarrinho] = useState([]);


  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get(`http://${base_URL}/api/produtos`);
        const produtosComImagens = response.data.map(produto => {
          // Verifica se o produto tem uma imagem
          if (produto.imagem) {
            // Converte o BLOB da imagem para uma URL utilizável
            const imagemUrl = blobToUrl(produto.imagem);
            console.log(`Produto ID ${produto.id} - Nome: ${produto.name} - URL da imagem:`, imagemUrl);
            return { ...produto, imagemUrl };
          } else {
            console.warn(`Produto com ID ${produto.id} não tem imagem.`);
            return produto;
          }
        });
        setProdutos(produtosComImagens);

        // Obter categorias únicas
        const categoriasUnicas = [...new Set(response.data.map(produto => produto.categoria))];
        setCategorias(categoriasUnicas);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('carrinho')) || [];
    setCarrinho(savedCart);
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro({ ...filtro, [name]: value });
  };

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
      <Header user={user} />
      <CartIcon carrinho={carrinho} setCarrinho={setCarrinho} /> {/* Passar carrinho e setCarrinho */}
      <main>
        <h2>Produtos</h2>
        <div className="filter">
          <select name="tipo" onChange={handleFiltroChange}>
            <option value="">Por Categoria</option>
            {categorias.map((categoria, index) => (
              <option key={index} value={categoria}>{categoria}</option>
            ))}
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
              <Link to={`/produto/${produto.id}`}>
                {produto.imagemUrl ? (
                  <img src={produto.imagemUrl} alt={produto.name} />
                ) : (
                  <p>Imagem não disponível</p>
                )}
                <h3>{produto.name}</h3>
              </Link>
              <p>R$ {Number(produto.preco).toFixed(2)}</p>
              <button onClick={() => adicionarAoCarrinho(produto)}>Adicionar ao Carrinho</button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Products;