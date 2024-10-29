import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/imagens/logo.png';
import '../assets/styles/global.css';
import '../assets/styles/Navbar.css';


const Navbar = () => (
  <header>
    <div className="App-logo">
    <img src={logo} alt="Logo da Empresa"/>
    <h1>Coffe For U</h1>
    </div>
<div className="Navbar">
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/produtos">Produtos</Link>
      <Link to="/carrinho">Carrinho</Link>
      <Link to="/login">Perfil</Link>
    </nav>
    </div>
  </header>
);

export default Navbar;
