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

export const uploadAndSetImage = async (file, userId, setUser, user) => {
  const base64String = await uploadImage(file);
  const response = await axios.post(`https://api-cafe-gourmet.vercel.app/api/upload-imagem/${userId}`, { imagem_usuario: base64String }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  alert(response.data.message);
  const imageUrl = blobToUrl(base64String);
  setUser({ ...user, userImage: imageUrl }); // Atualiza a imagem do usuário na tela
};