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

  try {
    const response = await axios.post('https://api-cafe-gourmet.vercel.app/api/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Resposta da solicitação:', response); // Adicione este log para verificar a resposta da solicitação
    return response.data.imageUrl; // Retorna a URL da imagem
  } catch (error) {
    console.error('Erro na solicitação de upload:', error.response ? error.response.data : error.message); // Adicione este log para verificar o erro
    throw error;
  }
};

export const handleImageUpload = async (file, userId) => {
  const base64String = await uploadAndSetImage(file, userId);
  return base64String;
};