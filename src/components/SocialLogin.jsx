import axios from 'axios';
import React from 'react';

const generateTemporaryPassword = () => {
  return Math.random().toString(36).slice(-6);
};

const handleSocialLogin = async (email, name) => {
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
  const redirectUri = 'https://coffeforyou.netlify.app/conta'; // Redirecionar para a tela de conta
  const scope = 'email profile';
  const responseType = 'token';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

  window.location.href = url;
};

const handleFacebookLogin = () => {
  const appId = '926133692789023';
  const redirectUri = 'https://coffeforyou.netlify.app/conta'; // Redirecionar para a tela de conta
  const scope = 'email';
  const responseType = 'token';
  const url = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

  window.location.href = url;
};

const handleSocialResponse = async (email, name) => {
  const tempPassword = generateTemporaryPassword();
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
};

const handleOAuthCallback = async () => {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get('access_token');

  if (accessToken) {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
      const { email, name } = response.data;

      // Chama a API de login-social do seu backend
      await handleSocialLogin(email, name);
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      alert('Erro ao obter informações do usuário. Tente novamente mais tarde.');
    }
  }
};

const handleSocialLoginFlow = async (email, name) => {
  try {
    const response = await axios.post('https://api-cafe-gourmet.vercel.app/verificar-usuario', { email });
    if (response.data.exists) {
      await handleSocialLogin(email, name);
    } else {
      alert('Usuário não tem conta cadastrada. Por favor, crie uma conta.');
      window.location.href = '/criarconta';
    }
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    alert('Erro ao verificar usuário. Tente novamente mais tarde.');
  }
};

const handleSocialSignupFlow = async (email, name) => {
  try {
    const response = await axios.post('https://api-cafe-gourmet.vercel.app/verificar-usuario', { email });
    if (response.data.exists) {
      alert('Usuário já cadastrado.');
      window.location.href = '/login';
    } else {
      await handleSocialResponse(email, name);
    }
  } catch (error) {
    console.error('Erro ao verificar usuário:', error);
    alert('Erro ao verificar usuário. Tente novamente mais tarde.');
  }
};

const SocialLogin = () => {
  React.useEffect(() => {
    handleOAuthCallback();
  }, []);

  return (
    <div className="social-login-container">
      <button onClick={handleGoogleLogin}>Login com Google</button>
      <button onClick={handleFacebookLogin}>Login com Facebook</button>
    </div>
  );
};

export default SocialLogin;
export { handleFacebookLogin, handleGoogleLogin, handleSocialLogin, handleSocialLoginFlow, handleSocialSignupFlow };

