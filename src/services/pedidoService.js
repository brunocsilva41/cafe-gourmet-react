import axios from 'axios';
import { getuserId } from '../utils/auth';
 

export const criarPedido = async (pedido) => {
  const userId = getuserId();
  if (!userId) {
    throw new Error('userId é obrigatório para criar pedido.');
  }
  try {
    console.log('Criando pedido com os seguintes dados:', {
      userId: userId,
      produtos: pedido.itens.map(item => ({
        id: item.id,
        nome: item.name,
        quantidade: item.quantidade,
        preco: item.preco
      })),
      total: pedido.total,
      totalComFrete: pedido.totalComFrete
    });
    const response = await axios.post(`https://api-cafe-gourmet.vercel.app/criar-pedido`, {
      userId: userId,
      produtos: pedido.itens.map(item => ({
        id: item.id,
        nome: item.name,
        quantidade: item.quantidade,
        preco: item.preco
      })),
      total: pedido.total, // Corrigido para enviar o total correto
      totalComFrete: pedido.totalComFrete // Adicionado totalComFrete
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error.response ? error.response.data : error.message);
    throw new Error('Erro ao criar pedido: ' + (error.response ? error.response.data.message : error.message));
  }
};

export const obterPedidos = async (userId) => {
  if (!userId) {
    throw new Error('userId é obrigatório para obter pedidos.');
  }
  try {
    console.log(`Obtendo pedidos para o userId: ${userId}`);
    const response = await axios.get(`https://api-cafe-gourmet.vercel.app/obter-pedidos/${userId}`);
    console.log('Pedidos recebidos do servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter pedidos:', error.response ? error.response.data : error.message);
    throw new Error('Erro ao obter pedidos: ' + (error.response ? error.response.data.message : error.message));
  }
};
