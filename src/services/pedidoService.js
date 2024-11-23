import axios from 'axios';
import { getuserId } from '../utils/auth';
import 

export const criarPedido = async (pedido) => {
  const userId = getuserId();
  if (!userId) {
    throw new Error('userId é obrigatório para criar pedido.');
  }
  try {
    const response = await axios.post(`https://api-cafe-gourmet.vercel.app/criar-pedido`, {
      userId: userId,
      produtos: pedido.itens.map(item => ({
        id: item.id,
        nome: item.name,
        quantidade: item.quantidade,
      })),
      total: pedido.totalComFrete
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
    const response = await axios.get(`https://api-cafe-gourmet.vercel.app/obter-pedidos/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter pedidos: ' + error.message);
  }
};
