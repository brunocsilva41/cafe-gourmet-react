import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/checkout.css';
import { isUserLoggedIn } from '../utils/authUtils';
import Header from './Header';

const Checkout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn());
  const [shippingCost, setShippingCost] = useState(0);
  const [deliveryEstimate, setDeliveryEstimate] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderTotalWithShipping, setOrderTotalWithShipping] = useState(0);
  const [orderDetails, setOrderDetails] = useState(JSON.parse(localStorage.getItem('carrinho')) || []);
  const [cep, setCep] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setOrderTotal(calculateOrderTotal(orderDetails));
    }
  }, [isLoggedIn, navigate, orderDetails]);

  const calculateOrderTotal = (orderDetails) => {
    return orderDetails.reduce((total, item) => total + Number(item.preco) * item.quantidade, 0);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleShippingCalculation = () => {
    const shippingCost = 10; // Simulação de custo fixo de entrega
    const deliveryEstimate = '3-5 dias úteis';
    setShippingCost(shippingCost);
    setDeliveryEstimate(deliveryEstimate);
    setOrderTotalWithShipping(orderTotal + shippingCost);
  };

  const handleOrderChange = (newOrderDetails) => {
    const orderTotal = calculateOrderTotal(newOrderDetails);
    setOrderDetails(newOrderDetails);
    setOrderTotal(orderTotal);
    setOrderTotalWithShipping(orderTotal + shippingCost);
    localStorage.setItem('carrinho', JSON.stringify(newOrderDetails));
  };

  const handleCheckoutConfirmation = () => {
    const pedido = {
      itens: orderDetails,
      total: orderTotal,
      totalComFrete: orderTotalWithShipping,
    };
    navigate('/confirmacao', { state: { pedido } });
  };

  const handleCepChange = (e) => {
    setCep(e.target.value);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const newOrderDetails = [...orderDetails];
    newOrderDetails[index].quantidade = newQuantity;
    handleOrderChange(newOrderDetails);
  };

  const increaseQuantity = (index) => {
    const newOrderDetails = [...orderDetails];
    newOrderDetails[index].quantidade += 1;
    handleOrderChange(newOrderDetails);
  };

  const decreaseQuantity = (index) => {
    const newOrderDetails = [...orderDetails];
    if (newOrderDetails[index].quantidade > 1) {
      newOrderDetails[index].quantidade -= 1;
      handleOrderChange(newOrderDetails);
    }
  };

  return (
    <>
      <Header />
      <div className="checkout-container">
        <h2>Checkout</h2>
        {!isLoggedIn && (
          <button onClick={handleLogin} className="login-button">Log In</button>
        )}
        <div className="order-details">
          <h3>Detalhes do Pedido</h3>
          <ul>
            {orderDetails.map((item, index) => (
              <li key={index}>
                <img src={item.imagemUrl} alt={item.name} />
                <div className="item-info">
                  <p>{item.name}</p>
                  <p>R$ {Number(item.preco).toFixed(2)}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => decreaseQuantity(index)}>-</button>
                  <input 
                    type="number" 
                    value={item.quantidade} 
                    onChange={(e) => handleQuantityChange(index, Number(e.target.value))} 
                    min="1"
                  />
                  <button onClick={() => increaseQuantity(index)}>+</button>
                </div>
              </li>
            ))}
          </ul>
          <p>Total: R$ {orderTotal.toFixed(2)}</p>
        </div>
        <div className="shipping">
          <h3>Entrega</h3>
          <input
            type="text"
            placeholder="Digite seu CEP"
            value={cep}
            onChange={handleCepChange}
            className="cep-input"
          />
          <button onClick={handleShippingCalculation} className="calculate-shipping-button">Calcular Entrega</button>
          {shippingCost > 0 && (
            <div className="shipping-details">
              <p>Custo de Entrega: R$ {shippingCost.toFixed(2)}</p>
              <p>Estimativa de Entrega: {deliveryEstimate}</p>
            </div>
          )}
        </div>
        <div className="order-total">
          <h3>Total do Pedido</h3>
          <p>Total: R$ {orderTotal.toFixed(2)}</p>
          {shippingCost > 0 && (
            <p>Total com Entrega: R$ {orderTotalWithShipping.toFixed(2)}</p>
          )}
        </div>
        <button onClick={handleCheckoutConfirmation} className="confirm-checkout-button">Confirmar Compra</button>
      </div>
    </>
  );
};

export default Checkout;
