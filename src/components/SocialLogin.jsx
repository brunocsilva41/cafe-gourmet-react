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
    alert('Erro no login social. Tente novamente mais tarde.');
  }
};

const handleGoogleLogin = () => {
  const clientId = '731636636395-dp041m5mii0ma67ueog72b3kei3uspeo.apps.googleusercontent.com';
  const redirectUri = 'https://coffeforyou.netlify.app/login'; // Redirecionar para a tela de login
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
    handleSocialLogin(email, name);
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    alert('Erro ao obter informações do usuário. Tente novamente mais tarde.');
  }
};

const handleSocialSignupFlow = async (email, name) => {
  console.log('Verificando usuário para criação de conta:', { email, name });
  try {
    const response = await axios.post('https://api-cafe-gourmet.vercel.app/login-social', { email, name });
    if (response.data.token) {
      alert('Usuário já cadastrado. Por favor, faça login com o Google.');
      window.location.href = '/login';
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      const tempPassword = Math.random().toString(36).slice(-6);
      console.log('Dados recebidos para criar conta:', { email, name, tempPassword });
      try {
        const response = await axios.post('https://api-cafe-gourmet.vercel.app/criar-conta-social', {
          email,
          name,
          password: tempPassword,
        });
        const { token, userId, userName, userEmail, userAddress, userPhone, userImage, role } = response.data;
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('userAddress', userAddress);
        localStorage.setItem('userPhone', userPhone);
        localStorage.setItem('userImage', userImage);
        localStorage.setItem('role', role);
        console.log('Conta criada com sucesso!', response.data);
        console.log(`Realize o acesso com sua senha temporária: ${tempPassword}`);
        window.location.href = '/conta';
      } catch (error) {
        console.error('Erro ao criar conta:', error);
        alert('Erro ao criar conta. Tente novamente mais tarde.');
      }
    } else {
      console.error('Erro ao verificar usuário:', error);
      alert('Erro ao verificar usuário. Tente novamente mais tarde.');
    }
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
export { handleGoogleLogin, handleGoogleCallback, handleSocialLogin, handleSocialSignupFlow };

