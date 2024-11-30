import axios from 'axios';
import React, { useEffect } from 'react';
import '../assets/styles/criarConta.css';
import Header from '../components/Header';
import { handleGoogleLogin, handleSocialSignupFlow } from './SocialLogin';

const base_URL = 'https://api-cafe-gourmet.vercel.app';

const CriarConta = () => {
  const [error, setError] = React.useState('');

  const handleOAuthCallback = async () => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');

    if (accessToken) {
      try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
        const { email, name } = response.data;
        console.log('Dados recebidos do Google:', { email, name });
        await handleSocialSignupFlow(email, name);
      } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        alert('Erro ao obter informações do usuário. Tente novamente mais tarde.');
      }
    }
  };

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  React.useEffect(() => {
    const tempPassword = localStorage.getItem('tempPassword');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');
    if (tempPassword && email) {
      alert(`Conta criada com sucesso! Sua senha temporária é: ${tempPassword}. Email: ${email}`);
      localStorage.removeItem('tempPassword');
    }
    if (email) {
      document.getElementById('email').value = email;
      localStorage.removeItem('email');
    }
    if (name) {
      document.getElementById('name').value = name;
      localStorage.removeItem('name');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const address = event.target.address.value;
    const phone = event.target.phone.value;

    console.log('Dados do formulário:', { name, email, password, address, phone });

    try {
      const response = await axios.post(`${base_URL}/criar-conta`, {
        name,
        email,
        password,
        address,
        phone,
      });

      console.log('Resposta da API:', response);

      if (response.status === 201) {
        alert('Conta criada com sucesso!');
        window.location.href = '/login';
      } else {
        setError('Erro ao criar conta.');
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao criar conta. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <>
    <Header />
    <div className='painel-criarconta'>
      <div className='formulario'>
        <div className='texto'>
          <h1>Criar Conta</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input type="text" name="name" id="name" required />
          <label>Email:</label>
          <input type="email" name="email" id="email" required />
          <label>Senha:</label>
          <input type="password" name="password" required />
          <label>Endereço:</label>
          <input type="text" name="address" required />
          <label>Telefone:</label>
          <input type="text" name="phone" required />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Criar Conta</button>
        </form>
        <div className="links-adicionais">
          <p>Ou</p>
          <button onClick={handleGoogleLogin}>Criar Conta com Google</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CriarConta;
