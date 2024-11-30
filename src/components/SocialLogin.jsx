import axios from 'axios';
import React from 'react';

const SocialLogin = () => {
  const generateTemporaryPassword = () => {
    return Math.random().toString(36).slice(-6);
  };

  const handleSocialResponse = async (email, name) => {
    const tempPassword = generateTemporaryPassword();
    try {
      await axios.post('https://api-cafe-gourmet.vercel.app/criar-conta', {
        email,
        name,
        password: tempPassword, // Use a senha temporária gerada
        address: '',
        phone: '',
      });
      alert(`Conta criada com sucesso! Sua senha temporária é: ${tempPassword}`);
      window.location.href = '/conta';
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      alert('Erro ao criar conta. Tente novamente mais tarde.');
    }
  };

  const handleGoogleLogin = () => {
    const clientId = '731636636395-dp041m5mii0ma67ueog72b3kei3uspeo.apps.googleusercontent.com';
    const redirectUri = 'https://coffeforyou.netlify.app/conta';
    const scope = 'email profile';
    const responseType = 'token';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    const email = '';
    const name = '';
    handleSocialResponse(email, name);

    window.location.href = url;
  };

  const handleFacebookLogin = () => {
    const appId = '926133692789023';
    const redirectUri = 'https://coffeforyou.netlify.app/conta';
    const scope = 'email';
    const responseType = 'token';
    const url = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;

    const email = '';
    const name = '';
    handleSocialResponse(email, name);

    window.location.href = url;
  };

  return (
    <div className="social-login-container">
      <button onClick={handleGoogleLogin}>Login com Google</button>
      <button onClick={handleFacebookLogin}>Login com Facebook</button>
    </div>
  );
};

export { SocialLogin, handleFacebookLogin, handleGoogleLogin };
