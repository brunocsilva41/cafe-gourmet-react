import axios from 'axios';

export const criarPedido = async (pedido) => {
  try {
    const response = await axios.post('https://api-cafe-gourmet.vercel.app/criar-pedido', pedido);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar pedido: ' + error.message);
  }
};

export const removerPedido = async (pedidoId) => {
  try {
    const response = await axios.delete(`https://api-cafe-gourmet.vercel.app/remover-pedido/${pedidoId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao remover pedido: ' + error.message);
  }
};

export const obterPedidos = async (userId) => {
  try {
    const response = await axios.get(`https://api-cafe-gourmet.vercel.app/obter-pedidos/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao obter pedidos: ' + error.message);
  }
};
