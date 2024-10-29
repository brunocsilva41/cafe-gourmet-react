import React from 'react';
import '../assets/styles/checkout.css';


class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      shippingCost: 0,
      deliveryEstimate: '',
      orderTotal: 0,
      orderTotalWithShipping: 0,
      orderDetails: {}
    };
  }

  componentDidMount() {
    // Fetch order details from props or API
    const orderDetails = this.props.orderDetails || {};
    this.setState({ orderDetails, orderTotal: this.calculateOrderTotal(orderDetails) });
  }

  calculateOrderTotal(orderDetails) {
    // Implement order total calculation logic
    return Object.values(orderDetails).reduce((total, item) => total + item.price * item.quantity, 0);
  }

  handleLogin = () => {
    // Implement login logic
    this.setState({ isLoggedIn: true });
  };

  handleShippingCalculation = () => {
    // Implement shipping cost and delivery estimate calculation logic
    const shippingCost = 10; // Example fixed cost
    const deliveryEstimate = '3-5 business days';
    this.setState({
      shippingCost,
      deliveryEstimate,
      orderTotalWithShipping: this.state.orderTotal + shippingCost
    });
  };

  handleOrderChange = (newOrderDetails) => {
    // Implement order change logic
    const orderTotal = this.calculateOrderTotal(newOrderDetails);
    this.setState({
      orderDetails: newOrderDetails,
      orderTotal,
      orderTotalWithShipping: orderTotal + this.state.shippingCost
    });
  };

  handleCheckoutConfirmation = () => {
    // Implement checkout confirmation logic
    if (this.state.isLoggedIn) {
      // Redirect to confirmation page
      this.props.history.push('/confirmation');
    } else {
      // Prompt user to log in
      alert('Please log in to complete your purchase.');
    }
  };

  render() {
    return (
      <div className="checkout">
        <h2>Checkout</h2>
        {!this.state.isLoggedIn && (
          <button onClick={this.handleLogin}>Log In</button>
        )}
        <div>
          <h3>Order Details</h3>
          {/* Render order details */}
        </div>
        <div>
          <h3>Shipping</h3>
          <button onClick={this.handleShippingCalculation}>Calculate Shipping</button>
          {this.state.shippingCost > 0 && (
            <div>
              <p>Shipping Cost: ${this.state.shippingCost}</p>
              <p>Delivery Estimate: {this.state.deliveryEstimate}</p>
            </div>
          )}
        </div>
        <div>
          <h3>Order Total</h3>
          <p>Total: ${this.state.orderTotal}</p>
          {this.state.shippingCost > 0 && (
            <p>Total with Shipping: ${this.state.orderTotalWithShipping}</p>
          )}
        </div>
        <button onClick={this.handleCheckoutConfirmation}>Confirm Checkout</button>
      </div>
    );
  }
}

export default Checkout;
