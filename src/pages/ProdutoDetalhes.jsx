import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../assets/styles/produto.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { blobToUrl } from '../utils/blobToUrl';

const base_URL = process.env.REACT_APP_BASE_URL;

const ProdutoDetalhes = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        console.log(`Buscando produto com ID: ${id}`); // Log para depuração
        const response = await axios.get(`http://${base_URL}/api/produtos/${id}`);
        console.log('Resposta do servidor:', response); // Log para depuração
        const produtoData = response.data;
        console.log('Dados do produto:', produtoData); // Log para depuração
        if (produtoData.imagem) {
          produtoData.imagemUrl = blobToUrl(produtoData.imagem);
        }
        setProduto(produtoData);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      }
    };

    fetchProduto();
  }, [id]);

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
        </div>
      </main>
    </>
  );
};

export default ProdutoDetalhes;
