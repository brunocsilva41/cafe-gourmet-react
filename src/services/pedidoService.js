import axios from 'axios';

export const criarPedido = async (pedido, userId) => {
  localStorage.getItem('userId');
  if (!userId) {
    throw new Error('userId é obrigatório para criar pedido.');
  }
  try {
    const response = await axios.post(`https://api-cafe-gourmet.vercel.app/criar-pedido/${userId}`, pedido);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar pedido: ' + error.message);
  }
};

export const obterPedidos = async (userId) => {
  localStorage.getItem('userId');
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
