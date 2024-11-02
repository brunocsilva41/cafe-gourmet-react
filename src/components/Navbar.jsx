import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/imagens/logo.png';
import '../assets/styles/global.css';
import '../assets/styles/Navbar.css';
import { useAuth } from '../context/AuthContext';
import CartIcon from './CartIcon';

const Navbar = ({ carrinho }) => {
  const { user } = useAuth();

  return (
    <header>
      <div className="App-logo">
        <img src={logo} alt="Logo da Empresa"/>
        <h1>Coffe For U</h1>
      </div>
      <div className="Navbar">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/produtos">Produtos</Link>
          <CartIcon carrinho={carrinho} />
          {user ? (
            <>
              <Link to="/pedidos">Pedidos</Link>
              <Link to="/conta">Conta</Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
