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

  const response = await axios.post('https://api-cafe-gourmet.vercel.app/api/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho da requisição
    }
  });

  return response.data.imageUrl; // Retorna a URL da imagem
};

export const handleImageUpload = async (file, userId) => {
  const base64String = await uploadAndSetImage(file, userId);
  return base64String;
};