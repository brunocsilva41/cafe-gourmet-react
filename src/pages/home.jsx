import React, { useState } from 'react';
import '../assets/styles/home.css';
import Header from '../components/Header.jsx';
import { sendEmail } from '../services/emailService';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    require('../assets/imagens/filial1.jpg'),
    require('../assets/imagens/filial2.jpg'),
    require('../assets/imagens/filial3.jpg')
  ];

  const captions = [
    "Filial 1 - Zona Sul",
    "Filial 2 - Zona Leste",
    "Filial 3 - Zona Oeste"
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    sendEmail(email);
  };

  return (
    <>
      <Header />
      <main className="main-panel">
        <h1 className="main-title">Bem-vindo à Cafeteria Gourmet</h1>
        <div className="content">
          <div className="company-info">
            <h2>Sobre a Empresa</h2>
            <p>Conheça a nossa história e descubra o que nos torna únicos.</p>
            <p>Oferecemos o melhor café, torrado com paixão e entregue fresco na sua porta.</p>
            <p>Visite nossas filiais e experimente a diferença.</p>
          </div>
          <div className="slides-panel">
            <h2>Nossas Filiais</h2>
            <div className="slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((slide, index) => (
                <div className="slide" key={index}>
                  <img src={slide} alt={`Slide ${index + 1}`} />
                  <div className="caption">{captions[index]}</div>
                </div>
              ))}
            </div>
            <div className="slide-buttons">
              <button className="slide-button" id="prev" onClick={prevSlide}>&#10094;</button>
              <button className="slide-button" id="next" onClick={nextSlide}>&#10095;</button>
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">
              <img src={require('../assets/imagens/logo.png')} alt="Café Gourmet" />
              <p>Premium coffee roasted with passion and delivered fresh to your doorstep.</p>
            </div>
            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/produtos">Shop</a></li>
                <li><a href="/conta">Account</a></li>
                <li><a href="/cart">Cart</a></li>
              </ul>
            </div>
            <div className="footer-contact">
              <h3>Contact</h3>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@cafegourmet.com</p>
              <p>Address: 123 Coffee Street, City</p>
            </div>
            <div className="footer-newsletter">
              <h3>Newsletter</h3>
              <p>Sign up for special offers and updates</p>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleSubscribe}>Subscribe</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Café Gourmet. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
