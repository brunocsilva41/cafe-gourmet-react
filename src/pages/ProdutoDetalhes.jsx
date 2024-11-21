import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/styles/produtosdetalhes.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { blobToUrl } from '../utils/blobToUrl';

const base_URL = process.env.REACT_APP_API_BASE_URL; // Certifique-se de que esta variável de ambiente está correta

const ProdutoDetalhes = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        console.log(`Buscando produto com ID: ${id}`); // Log para depuração
        const response = await axios.get(`${base_URL}/api/produtos/${id}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        if (response.headers['content-type'].includes('application/json')) {
          console.log('Resposta do servidor:', response.data); // Adicionar log para verificar a resposta da API
          const produtoData = response.data;
          console.log('Dados do produto:', produtoData); // Log para depuração
          if (produtoData.imagem) {
            produtoData.imagemUrl = blobToUrl(produtoData.imagem);
          }
          setProduto(produtoData);
        } else {
          console.error('Resposta inesperada do servidor:', response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      }
    };

    fetchProduto();
  }, [id]);

  const adicionarAoCarrinho = () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtoNoCarrinho = carrinho.find(item => item.id === produto.id);
    if (produtoNoCarrinho) {
      produtoNoCarrinho.quantidade += 1;
    } else {
      carrinho.push({ ...produto, quantidade: 1 });
    }
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  };

  if (!produto) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Header user={user} />
      <main>
        <div className="product-item">
        <h2>{produto.name}</h2>
        {produto.imagemUrl ? (
          <img src={produto.imagemUrl} alt={produto.name} />
        ) : (
          <p>Imagem não disponível</p>
        )}
        <p>R$ {Number(produto.preco).toFixed(2)}</p>
        <p>{produto.descricao}</p>
        <p>Quantidade disponível: {produto.estoque}</p>
        {/* Adicione mais detalhes conforme necessário */}
        <button onClick={adicionarAoCarrinho}>Adicionar ao Carrinho</button>
        </div>
      </main>
    </>
  );
};

export default ProdutoDetalhes;
