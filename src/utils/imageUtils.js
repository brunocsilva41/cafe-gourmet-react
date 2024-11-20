import axios from 'axios';
import { blobToUrl } from './blobToUrl';

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
  const base64String = await uploadImage(file);
  const binaryData = atob(base64String);
  const blob = new Blob([binaryData], { type: 'image/jpeg' }); // Ajuste o tipo conforme necessário
  const formData = new FormData();
  formData.append('imagem_usuario', blob);

  const response = await axios.post(`https://api-cafe-gourmet.vercel.app/api/upload-imagem/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  alert(response.data.message);
  return blobToUrl(base64String); // Retorna a URL para visualização
};

export const handleImageUpload = async (file, userId) => {
  // Gera a URL para exibição e armazena a imagem no banco de dados
  const imageUrl = await uploadAndSetImage(file, userId);
  return imageUrl;
};