import React, { useState } from 'react';
import { createSpace } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function CreateSpace() {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        capacity: 0,
        description: '',
        pricePerHour: 0
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await createSpace(formData);

            setSuccess(true);

            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err) {
            const errorMessage = err.message || 'Falha ao cadastrar o espaço.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-space-container">
            <h2>Cadastrar Novo Espaço</h2>

            {loading && <p style={{ color: 'blue' }}>Processando cadastro...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
            {success && <p style={{ color: 'green' }}>Espaço cadastrado com sucesso!</p>}

            <form onSubmit={handleSubmit}>

                <label htmlFor="name">Nome:</label>
                <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label htmlFor="type">Tipo:</label>
                <select id="type" name="type" value={formData.type} onChange={handleChange} required>
                    <option value="">Selecione o Tipo</option>
                    <option value="sala">Sala de Reunião</option>
                    <option value="auditorio">Auditório</option>
                    <option value="coworking">Área de Coworking</option>
                    <option value="laboratorio">Laboratório</option>
                </select>

                <label htmlFor="capacity">Capacidade (Pessoas):</label>
                <input id="capacity" type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" required />

                <label htmlFor="pricePerHour">Preço por Hora (R$):</label>
                <input id="pricePerHour" type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleChange} min="0" required />

                <label htmlFor="description">Descrição:</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} />

                <button type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Cadastrar Espaço'}
                </button>
            </form>
        </div>
    );
}

export default CreateSpace;