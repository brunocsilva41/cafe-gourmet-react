import axios from 'axios';
import React from 'react';

const generateTemporaryPassword = () => {
  return Math.random().toString(36).slice(-6);
};

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
  const redirectUri = 'https://coffeforyou.netlify.app/conta';
  const scope = 'email profile';
  const responseType = 'token';
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

  window.location.href = url;
};

const handleSocialResponse = async (email, name) => {
  const tempPassword = generateTemporaryPassword();
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
  console.log('Verificando usuário para criação de conta:', { email, name });
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
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');

    if (accessToken) {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`)
        .then(response => {
          const { email, name } = response.data;
          console.log('Dados recebidos do Google:', { email, name });
          handleSocialSignupFlow(email, name);
        })
        .catch(error => {
          console.error('Erro ao obter informações do usuário:', error);
          alert('Erro ao obter informações do usuário. Tente novamente mais tarde.');
        });
    }
  }, []);

  return (
    <div className="social-login-container">
      <button onClick={handleGoogleLogin}>Login com Google</button>
    </div>
  );
};

export default SocialLogin;
export { handleGoogleLogin, handleSocialLogin, handleSocialLoginFlow, handleSocialSignupFlow };

