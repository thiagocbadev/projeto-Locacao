import React, { useState } from 'react';
import { createUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function CreateUser() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const newUser = await createUser(formData);

            setSuccess(true);

            setTimeout(() => {
                navigate('/');
            }, 2000);

            console.log('Usuário Cadastrado:', newUser._id);

        } catch (err) {
            const errorMessage = err.message || 'Falha ao cadastrar o usuário.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-user-container">
            <h2>Cadastrar Novo Cliente/Usuário</h2>

            {loading && <p style={{ color: 'blue' }}>Processando cadastro...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            {success && <p style={{ color: 'green' }}>Usuário cadastrado com sucesso!</p>}

            <form onSubmit={handleSubmit}>

                <label htmlFor="name">Nome:</label>
                <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label htmlFor="email">Email:</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label htmlFor="phone">Telefone:</label>
                <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />

                <button type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
                </button>
            </form>
        </div>
    );
}

export default CreateUser;