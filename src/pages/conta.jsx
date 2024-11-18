import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Conta = ({ userId }) => {
    const [metodos, setMetodos] = useState([]);
    const [tipo, setTipo] = useState('');
    const [detalhes, setDetalhes] = useState({});
    const [mensagem, setMensagem] = useState('');

    // Carregar métodos de pagamento
    useEffect(() => {
        axios.get(`/api/metodos-de-pagamento/${userId}`)
            .then((response) => {
                const { data, message } = response.data;
                if (data.length === 0) {
                    setMensagem(message); // "Não há métodos de pagamento cadastrados"
                } else {
                    setMetodos(data);
                }
            })
            .catch((err) => console.error('Erro ao carregar métodos:', err));
    }, [userId]);

    // Função para adicionar método de pagamento
    const adicionarMetodo = () => {
        axios.post(`/api/add-metodos-de-pagamento/${userId}`, { tipo, detalhes })
            .then((response) => {
                alert(response.data.message);
                setTipo('');
                setDetalhes({});
                setMensagem('');
                // Recarregar lista de métodos
                axios.get(`/api/metodos-de-pagamento/${userId}`)
                    .then((res) => setMetodos(res.data.data));
            })
            .catch((err) => console.error('Erro ao adicionar método:', err));
    };

    return (
        <div>
            <h1>Conta</h1>
            <h2>Métodos de Pagamento</h2>
            {metodos.length > 0 ? (
                <ul>
                    {metodos.map((metodo) => (
                        <li key={metodo.id}>{metodo.tipo} - {JSON.stringify(metodo.detalhes)}</li>
                    ))}
                </ul>
            ) : (
                <p>{mensagem}</p>
            )}

            <h2>Adicionar Método de Pagamento</h2>
            <select onChange={(e) => setTipo(e.target.value)} value={tipo}>
                <option value="">Selecione o tipo</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="pix">Pix</option>
            </select>

            {tipo === 'cartao_credito' && (
                <>
                    <input type="text" placeholder="Número do Cartão" onChange={(e) => setDetalhes({ ...detalhes, numero_cartao: e.target.value })} />
                    <input type="text" placeholder="Validade" onChange={(e) => setDetalhes({ ...detalhes, validade: e.target.value })} />
                    <input type="text" placeholder="CVV" onChange={(e) => setDetalhes({ ...detalhes, cvv: e.target.value })} />
                </>
            )}
            {tipo === 'pix' && (
                <input type="text" placeholder="Chave Pix" onChange={(e) => setDetalhes({ ...detalhes, chave_pix: e.target.value })} />
            )}

            <button onClick={adicionarMetodo}>Adicionar</button>
        </div>
    );
};

export default Conta;
