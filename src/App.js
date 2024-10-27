import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Carrinho from './components/carrinho';
import Checkout from './components/checkout';
import Confirmacao from './components/confirmacao';
import Conta from './components/conta';
import Criarconta from './components/Criarconta';
import Home from './components/home';
import Login from './components/login';
import Navbar from './components/Navbar';
import Produtos from './components/produtos';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/conta" element={<Conta />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/confirmacao" element={<Confirmacao />} />
      <Route path="/login" element={<Login />} />
      <Route path="/criarConta" element={<Criarconta />} />
    </Routes>
  </Router>
);

export default App;
