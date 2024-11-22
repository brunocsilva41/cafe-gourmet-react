import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Checkout from './components/checkout';
import Confirmacao from './components/confirmacao';
import Criarconta from './components/Criarconta';
import Login from './components/login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/cart';
import Conta from './pages/conta';
import Home from './pages/home';
import Pedidos from './pages/pedidos';
import ProdutoDetalhes from './pages/ProdutoDetalhes';
import Produtos from './pages/produtos';

const App = () => {
  const [carrinho, setCarrinho] = useState([]);
  
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('carrinho')) || [];
    setCarrinho(savedCart);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <CartProvider>
        <Navbar carrinho={carrinho} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/produto/:id" element={<ProdutoDetalhes />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/conta" element={<PrivateRoute><Conta /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/confirmacao" element={<Confirmacao />} />
          <Route path="/login" element={<Login />} />
          <Route path="/criarConta" element={<Criarconta />} />
          <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Routes>
        </CartProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;
