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
  const response = await axios.post(`https://api-cafe-gourmet.vercel.app/api/upload-imagem/${userId}`, { imagem_usuario: base64String }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  alert(response.data.message);
  return blobToUrl(base64String); // Retorna a URL para visualização
};

export const convertImageToBlobAndStore = async (file, userId) => {
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
  return blob; // Retorna o blob para armazenamento
};

export const handleImageUpload = async (file, userId) => {
  // Cria duas cópias do arquivo da imagem
  const fileCopyForUrl = new File([file], file.name, { type: file.type });
  const fileCopyForBlob = new File([file], file.name, { type: file.type });

  // Gera a URL para exibição
  const imageUrl = await uploadAndSetImage(fileCopyForUrl, userId);

  // Converte a imagem em blob e armazena no banco de dados
  const blob = await convertImageToBlobAndStore(fileCopyForBlob, userId);

  return { imageUrl, blob };
};