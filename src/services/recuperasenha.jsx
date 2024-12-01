import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../assets/styles/recuperasenha.css';

const RecuperaSenha = () => {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/recuperar-senha', { email });
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Nova senha solicitada',
                    text: `Uma nova senha foi enviada para o email ${email}`,
                });
            }
            if(response.status === 404){
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível localizar esse email em algum cadastro.',
                });
            }if(response.status === 500){
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao enviar email.',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível solicitar uma nova senha. Tente novamente mais tarde.',
            });
        }
    };

    return (
        <div className="recupera-senha-container">
            <h2>Recuperar Senha</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                </div>
                <button type="submit">Solicitar nova senha</button>
            </form>
        </div>
    );
};

export default RecuperaSenha;