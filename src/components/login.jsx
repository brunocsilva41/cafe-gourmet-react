import { default as React, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';
import '../assets/styles/global.css';
import '../assets/styles/login.css';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../utils/authUtils';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setUseremail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log('Tentando login com:', { email, password });
      await loginUser(email, password, login, navigate, location);
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
          <img src="" alt="Logo da Empresa" className="logo" />
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
            <a href="../services/recuperasenha.js">Esqueci a senha</a>
          </form>
          <br />
          <div className="additional-links">
            <p>Ou</p>
            <button className="social-login google">Login com Google</button>
            <button className="social-login facebook">Login com Facebook</button>
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
