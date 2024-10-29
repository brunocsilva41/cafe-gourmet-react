import axios from 'axios';
import { default as React } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';
import '../assets/styles/global.css';
import '../assets/styles/login.css';


const Login = () => {
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('http://localhost:3005/login-conta', {
        email,
        password,
      });

      if (response.status === 200 && response.data.token) {
        const { token, userId, userName, userEmail , role} = response.data;
        localStorage.setItem('token', token); 
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('role', role);
        navigate('/conta'); // Redireciona para a página de conta
  
        
      } else {
        console.error('Erro ao fazer login:', response.data.message);
        alert('Erro ao fazer login.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao realizar o login. Tente novamente mais tarde.');
    }
  };
  return (
    

      <div className="container">
        <div className="login-form">
          <img src="" alt="Logo da Empresa" className="logo" />
          <h2> Realize o Login com:</h2>
          <form id="loginForm" onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="password">Senha:</label>
            <input type="password" id="password" name="password" minLength="3" required />
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
              <Link to="/create-account" className="criarconta">CRIAR CONTA</Link>
            </button>

          </div>
        </div>
        
      </div>
        
      
  );
};

export default Login;
