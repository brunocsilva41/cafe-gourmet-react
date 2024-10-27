import React from 'react';
import { useNavigate } from 'react-router-dom'; // Substitui useHistory por useNavigate
import '../assets/styles/confirmacao.css';

const Confirmacao = ({ pedido }) => {
    const navigate = useNavigate(); // useNavigate ao invés de useHistory

    const processarCompra = () => {
        // Processar o pedido
        console.log('Processando pedido:', pedido);

        // Redirecionar para a página de checkout com os detalhes do pedido
        navigate('/checkout', { state: { pedido } });
    };

    return (
        <div className="confirmacao-container">
            <h1>Confirmação de Compra</h1>
            <div className="detalhes-pedido">
                <h2>Detalhes do Pedido</h2>
                <ul>
                    {pedido && pedido.itens && pedido.itens.length > 0 ? (
                        pedido.itens.map((item, index) => (
                            <li key={index}>
                                {item.nome} - {item.quantidade} x R$ {item.preco.toFixed(2)}
                            </li>
                        ))
                    ) : (
                        <p>Não há itens no pedido.</p>
                    )}
                </ul>
                <p>Total: R$ {pedido ? pedido.total.toFixed(2) : '0.00'}</p>
            </div>
            <button onClick={processarCompra}>Confirmar Compra</button>
        </div>
    );
};

export default Confirmacao;
