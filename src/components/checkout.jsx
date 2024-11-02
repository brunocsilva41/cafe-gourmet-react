import React from 'react';
import '../assets/styles/checkout.css';
import Header from './Header';

class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
      shippingCost: 0,
      deliveryEstimate: '',
      orderTotal: 0,
      orderTotalWithShipping: 0,
      orderDetails: JSON.parse(localStorage.getItem('carrinho')) || [],
      cep: ''
    };
  }

  componentDidMount() {
    const orderDetails = this.state.orderDetails;
    this.setState({ orderTotal: this.calculateOrderTotal(orderDetails) });
  }

  calculateOrderTotal(orderDetails) {
    return orderDetails.reduce((total, item) => total + Number(item.preco) * item.quantidade, 0);
  }

  handleLogin = () => {
    this.setState({ isLoggedIn: true });
    localStorage.setItem('isLoggedIn', 'true');
  };

  handleShippingCalculation = () => {
    const shippingCost = 10; // Simulação de custo fixo de entrega
    const deliveryEstimate = '3-5 dias úteis';
    this.setState({
      shippingCost,
      deliveryEstimate,
      orderTotalWithShipping: this.state.orderTotal + shippingCost
    });
  };

  handleOrderChange = (newOrderDetails) => {
    const orderTotal = this.calculateOrderTotal(newOrderDetails);
    this.setState({
      orderDetails: newOrderDetails,
      orderTotal,
      orderTotalWithShipping: orderTotal + this.state.shippingCost
    });
  };

  handleCheckoutConfirmation = () => {
    this.props.history.push('/confirmacao', { state: { pedido: this.state.orderDetails } });
  };

  handleCepChange = (e) => {
    this.setState({ cep: e.target.value });
  };

  render() {
    return (
      <>
        <Header />
        <div className="checkout">
          <h2>Checkout</h2>
          {!this.state.isLoggedIn && (
            <button onClick={this.handleLogin} className="login-button">Log In</button>
          )}
          <div className="order-details">
            <h3>Detalhes do Pedido</h3>
            <ul>
              {this.state.orderDetails.map((item, index) => (
                <li key={index}>
                  {item.nome} - {item.quantidade} x R$ {Number(item.preco).toFixed(2)}
                </li>
              ))}
            </ul>
            <p>Total: R$ {this.state.orderTotal.toFixed(2)}</p>
          </div>
          <div className="shipping">
            <h3>Entrega</h3>
            <input
              type="text"
              placeholder="Digite seu CEP"
              value={this.state.cep}
              onChange={this.handleCepChange}
              className="cep-input"
            />
            <button onClick={this.handleShippingCalculation} className="calculate-shipping-button">Calcular Entrega</button>
            {this.state.shippingCost > 0 && (
              <div className="shipping-details">
                <p>Custo de Entrega: R$ {this.state.shippingCost.toFixed(2)}</p>
                <p>Estimativa de Entrega: {this.state.deliveryEstimate}</p>
              </div>
            )}
          </div>
          <div className="order-total">
            <h3>Total do Pedido</h3>
            <p>Total: R$ {this.state.orderTotal.toFixed(2)}</p>
            {this.state.shippingCost > 0 && (
              <p>Total com Entrega: R$ {this.state.orderTotalWithShipping.toFixed(2)}</p>
            )}
          </div>
          <button onClick={this.handleCheckoutConfirmation} className="confirm-checkout-button">Confirmar Compra</button>
        </div>
      </>
    );
  }
}

export default Checkout;
