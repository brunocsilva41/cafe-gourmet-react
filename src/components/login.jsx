import axios from 'axios';
import { default as React, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';
import Swal from 'sweetalert2';
import logo from '../assets/imagens/logoOF.png';
import '../assets/styles/global.css';
import '../assets/styles/login.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { isUserLoggedIn, loginUser } from '../utils/auth';
import { handleGoogleLogin, handleSocialLogin } from './SocialLogin';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isUserLoggedIn()) {
      navigate('/conta');
    }
  }, [navigate]); // Certifique-se de que o array de dependências está correto

  const handleOAuthCallback = async () => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');

    if (accessToken) {
      try {
        const response = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
        const { email, name } = response.data;
        await handleSocialLogin(email, name);
      } catch (error) {
        console.error('Erro ao obter informações do usuário:', error);
        Swal.fire({
          title: 'Erro ao obter informações do usuário',
          text: 'Tente novamente mais tarde.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Tentando login com:', { email, password });
      const userData = await loginUser(email, password, login, navigate, location);
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userName', userData.userName);
      localStorage.setItem('role', userData.role);
      Swal.fire({
        title: 'Login realizado com sucesso!',
        text: `Bem-vindo, ${userData.userName}!`,
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/conta');
      });
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Falha no login. Verifique suas credenciais e tente novamente.');
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="login-form">
          <img src={logo} alt="Logo da Empresa" className="logo" />
          <h2> Realize o Login com:</h2>
          {error && <p className="error-message">{error}</p>}
          <form id="loginForm" onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setUseremail(e.target.value)}
              required
            />
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="3"
              required
            />
            <button type="submit">Login</button>
            <br />
            <a href='/recuperasenha'>Esqueci a senha</a>
          </form>
          <br />
          <div className="additional-links">
            <p>Ou</p>
            <button className="social-login google" onClick={handleGoogleLogin}>Login com Google</button>
          </div>
          <div>
            <h2>Não tem uma conta?</h2>
            <button>
              <Link to="/Criarconta" className="criarconta">CRIAR CONTA</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
