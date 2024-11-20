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
  const base64String = await uploadImage(file);
  const response = await axios.post(`https://api-cafe-gourmet.vercel.app/api/upload-imagem/${userId}`, { imagem_usuario: base64String }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  alert(response.data.message);
  return base64String; // Retorna a string base64 para visualização
};

export const handleImageUpload = async (file, userId) => {
  // Gera a string base64 para exibição e armazena a imagem no banco de dados
  const base64String = await uploadAndSetImage(file, userId);
  return base64String;
};