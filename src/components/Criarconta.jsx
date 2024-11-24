import axios from 'axios';
import React from 'react';
import '../assets/styles/criarConta.css';
import Header from '../components/Header';

const base_URL = 'https://api-cafe-gourmet.vercel.app';

const CriarConta = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const address = event.target.address.value;
    const phone = event.target.phone.value;

    try {
      const response = await axios.post(`${base_URL}/criar-conta`, {
        name,
        email,
        password,
        address,
        phone,
      });

      if (response.status === 201) {
        alert('Conta criada com sucesso!');
        window.location.href = '/login';
      } else {
        alert('Erro ao criar conta.');
      }
    } catch (error) {
      alert('Erro ao criar conta. Tente novamente mais tarde.');
    }
  };

  return (
    <>
    <Header />
    <div className='painel-criarconta'>
      <div className='formulario'>
        <div className='texto'>
          <h1>Criar Conta</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input type="text" name="name" required />
          <label>Email:</label>
          <input type="email" name="email" required />
          <label>Senha:</label>
          <input type="password" name="password" required />
          <label>Endereço:</label>
          <input type="text" name="address" required />
          <label>Telefone:</label>
          <input type="text" name="phone" required />
          <button type="submit">Criar Conta</button>
        </form>
        <div className="links-adicionais">
          <p>Ou</p>
          <button className="social-login google">Login com Google</button>
          <button className="social-login facebook">Login com Facebook</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CriarConta;
