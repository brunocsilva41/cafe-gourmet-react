import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/produtos.css'; // Importa o CSS para estilizar os produtos
import CartIcon from '../components/CartIcon';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { blobToUrl } from '../utils/blobToUrl';

const base_URL = process.env.REACT_APP_BASE_URL;

if (!base_URL) {
  console.error('REACT_APP_BASE_URL não está definida. Verifique suas variáveis de ambiente.');
} else {
  console.log('Base URL da API:', base_URL);
}

const Products = () => {
  const { user } = useAuth();
  const { adicionarAoCarrinho } = useContext(CartContext);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState({
    tipo: [],
    ordenar: '',
    precoMin: '',
    precoMax: ''
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const observer = useRef();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await axios.get(`https://api-cafe-gourmet.vercel.app/api/produtos`);
        const data = response.data;
        if (Array.isArray(data)) {
          const produtosComImagens = data.map(produto => {
            if (produto.imagem) {
              const imagemUrl = blobToUrl(produto.imagem);
              return { ...produto, imagemUrl };
            } else {
              return produto;
            }
          });
          setProdutos(produtosComImagens);

          const categoriasUnicas = [...new Set(data.map(produto => produto.categoria))];
          setCategorias(categoriasUnicas);
        } else {
          console.error('A resposta da API não é um array:', data);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFiltro((prevFiltro) => ({
        ...prevFiltro,
        tipo: checked
          ? [...prevFiltro.tipo, value]
          : prevFiltro.tipo.filter((categoria) => categoria !== value)
      }));
    } else {
      setFiltro({ ...filtro, [name]: value });
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAdicionarAoCarrinho = (produto) => {
    adicionarAoCarrinho(produto);
    showNotification(`${produto.name} foi adicionado ao carrinho!`);
  };

  const produtosFiltrados = produtos
    .filter(produto => 
      (filtro.tipo.length > 0 ? filtro.tipo.includes(produto.categoria) : true) &&
      (filtro.precoMin ? produto.preco >= filtro.precoMin : true) &&
      (filtro.precoMax ? produto.preco <= filtro.precoMax : true)
    )
    .sort((a, b) => {
      if (filtro.ordenar === 'preco-asc') return a.preco - b.preco;
      if (filtro.ordenar === 'preco-desc') return b.preco - a.preco;
      return 0;
    });

  useEffect(() => {
    const lazyLoadImages = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.current.unobserve(img);
        }
      });
    };

    observer.current = new IntersectionObserver(lazyLoadImages, {
      rootMargin: '0px 0px 50px 0px',
      threshold: 0.01
    });

    const images = document.querySelectorAll('.lazy-load');
    images.forEach(img => observer.current.observe(img));

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [produtosFiltrados]);

  return (
    <>
      <Header user={user} />
      <CartIcon />
      {notification && <div className="notification">{notification}</div>}
      <h2>Produtos</h2>
      <main>
        <div className="filter-container">
          <div className="filter filter-category">
            <h4>Filtrar por Categoria</h4>
            {categorias.map((categoria, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  name="tipo"
                  value={categoria}
                  onChange={handleFiltroChange}
                />
                {categoria}
              </label>
            ))}
          </div>
          <div className="filter filter-options">
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
        </div>
        {loading ? (
          <div className="loading-spinner">Carregando...</div>
        ) : (
          <div className="product-list">
            {produtosFiltrados.map((produto, index) => (
              <div key={index} className="product-item">
                <Link to={`/produto/${produto.id}`}>
                  {produto.imagemUrl ? (
                    <img
                      data-src={produto.imagemUrl}
                      alt={produto.name}
                      className="lazy-load"
                    />
                  ) : (
                    <p>Imagem não disponível</p>
                  )}
                  <h3>{produto.name}</h3>
                </Link>
                <p>R$ {Number(produto.preco).toFixed(2)}</p>
                <button onClick={() => handleAdicionarAoCarrinho(produto)}>Adicionar ao Carrinho</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Products;