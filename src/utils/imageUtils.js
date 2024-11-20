import axios from 'axios';

export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadAndSetImage = async (file, userId) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('userId', userId);

  const token = localStorage.getItem('token'); // Obtém o token do localStorage

  if (!token) {
    throw new Error('Token de autenticação não encontrado.');
  }

  console.log('Token de autenticação:', token); // Adicione este log para verificar o token

  try {
    const response = await axios.post('https://api-cafe-gourmet.vercel.app/api/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho da requisição
      }
    });

    console.log('Resposta da solicitação:', response); // Adicione este log para verificar a resposta da solicitação
    return response.data.imageUrl; // Retorna a URL da imagem
  } catch (error) {
    console.error('Erro na solicitação de upload:', error); // Adicione este log para verificar o erro
    throw error;
  }
};

export const handleImageUpload = async (file, userId) => {
  const base64String = await uploadAndSetImage(file, userId);
  return base64String;
};