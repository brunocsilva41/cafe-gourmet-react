import axios from 'axios';

export const criarPedido = async (pedido) => {
  try {
    const response = await axios.post('/criar-pedido', pedido);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao criar pedido: ' + error.message);
  }
};