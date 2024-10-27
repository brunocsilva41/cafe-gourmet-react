import axios from 'axios';
import React from 'react';

const CriarConta = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('http://localhost:3000/criar-conta', {
        name,
        email,
        password,
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
    <form onSubmit={handleSubmit}>
      <label>Nome:</label>
      <input type="text" name="name" required />
      <label>Email:</label>
      <input type="email" name="email" required />
      <label>Senha:</label>
      <input type="password" name="password" required />
      <button type="submit">Criar Conta</button>
    </form>
  );
};

export default CriarConta;
