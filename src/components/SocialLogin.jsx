import axios from 'axios';
import React from 'react';

const handleSocialLogin = async (email, name) => {
  console.log('Dados recebidos para login:', { email, name });
  try {
    const response = await axios.post('https://api-cafe-gourmet.vercel.app/login-social', { email, name });
    const { token, userId, userName, userEmail, address, telefone_usuario, imagem_usuario, role } = response.data;
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userAddress', address);
    localStorage.setItem('userPhone', telefone_usuario);
    localStorage.setItem('userImage', imagem_usuario);
    localStorage.setItem('role', role);
    console.log('Login realizado com sucesso!', response.data);
    window.location.href = '/conta';
  } catch (error) {
    console.error('Erro no login social:', error);
    alert('Erro no login social. Não foi Possivel Localizar essa Conta.');
  }
};

const generateTemporaryPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const handleSocialSignUp = async (email, name) => {
  const temporaryPassword = generateTemporaryPassword();
  try {
    const checkUserResponse = await axios.post('https://api-cafe-gourmet.vercel.app/consulta-usuario', { email });
    if (checkUserResponse.status === 200) {
      alert('Usuário já existe. Por favor, faça login.');
      window.location.href = '/login';
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const createUserResponse = await axios.post('https://api-cafe-gourmet.vercel.app/criar-conta-social', { email, name, password: temporaryPassword });
        if (createUserResponse.status === 201) {
          const message = `
            <div>
              <p>Conta criada com sucesso! Realize o login com as credenciais:</p>
              <p>Email: <span id="email">${email}</span> <button onclick="copyToClipboard('email')">Copiar</button></p>
              <p>Senha Temporária: <span id="temporaryPassword">${temporaryPassword}</span> <button onclick="copyToClipboard('temporaryPassword')">Copiar</button></p>
            </div>
          `;
          const wrapper = document.createElement('div');
          wrapper.innerHTML = message;
          document.body.appendChild(wrapper);
          window.location.href = '/login';
        }
      } catch (createError) {
        console.error('Erro ao criar conta social:', createError);
        alert('Erro ao criar conta social. Tente novamente mais tarde.');
      }
    } else {
      console.error('Erro ao verificar usuário:', error);
      alert('Erro ao verificar usuário. Tente novamente mais tarde.');
    }
  }
};

const copyToClipboard = (id) => {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Texto copiado para a área de transferência');
  });
};

const handleGoogleLogin = () => {
  const clientId = '731636636395-dp041m5mii0ma67ueog72b3kei3uspeo.apps.googleusercontent.com';
  const redirectUri = 'https://coffeforyou.netlify.app/login'; // Redirecionar para a tela de login
  const scope = 'email profile';
  const responseType = 'token';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

  window.location.href = url;
};

const handleGoogleSignUp = () => {
  const clientId = '731636636395-dp041m5mii0ma67ueog72b3kei3uspeo.apps.googleusercontent.com';
  const redirectUri = 'https://coffeforyou.netlify.app/Criarconta'; // Redirecionar para a tela de criar conta
  const scope = 'email profile';
  const responseType = 'token';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

  window.location.href = url;
};

const handleGoogleCallback = async (accessToken) => {
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { email, name } = response.data;
    console.log('Dados recebidos do Google:', { email, name });
    handleSocialSignUp(email, name);
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    alert('Erro ao obter informações do usuário. Tente novamente mais tarde.');
  }
};

const SocialLogin = () => {
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');

    if (accessToken) {
      handleGoogleCallback(accessToken);
    }
  }, []);

  return (
    <div className="social-login-container">
      <button onClick={handleGoogleLogin}>Login com Google</button>
    </div>
  );
};

export default SocialLogin;
export { copyToClipboard, generateTemporaryPassword, handleGoogleCallback, handleGoogleLogin, handleGoogleSignUp, handleSocialLogin, handleSocialSignUp };

