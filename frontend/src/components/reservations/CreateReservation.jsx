import React, { useState, useEffect } from 'react';
import { createReservation, getSpaces, getUsers } from '../../services/api';
import { Link } from 'react-router-dom';

function CreateReservation() {
    const [spaces, setSpaces] = useState([]);
    const [users, setUsers] = useState([]);

    const [formData, setFormData] = useState({
        spaceId: '',
        userId: '',
        start: '',
        end: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const spaceData = await getSpaces();
                setSpaces(spaceData);

                const userData = await getUsers();
                setUsers(userData);

                const initialSpaceId = spaceData.length > 0 ? spaceData[0]._id : '';
                const initialUserId = userData.length > 0 ? userData[0]._id : '';

                setFormData(prev => ({
                    ...prev,
                    spaceId: initialSpaceId,
                    userId: initialUserId
                }));

            } catch (err) {
                console.error("Não foi possível carregar os dados iniciais:", err);
                setError('Erro ao carregar dados de espaços ou clientes. Verifique o backend.');
            }
        };
        fetchData();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!formData.userId || !formData.spaceId) {
            setError('Selecione um Cliente e um Espaço para continuar.');
            setLoading(false);
            return;
        }

        try {
            const result = await createReservation(formData);

            console.log('Dados recebidos do Backend:', result);

            setSuccess(result);

        } catch (err) {
            const errorMessage = err.message || 'Falha ao criar reserva. Verifique a disponibilidade.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const isDataLoading = loading || spaces.length === 0 || users.length === 0;

    return (
        <div className="create-reservation-container">
            <h2>Nova Reserva de Espaço</h2>

            {loading && <p className="alert-info">Verificando disponibilidade...</p>}

            {error && <p className="alert-error">ERRO: {error}</p>}

            {success && (
                <div className="reservation-summary-success">
                    <p style={{ fontWeight: 'bold' }}>Reserva Confirmada com Sucesso!</p>
                    <p>Orçamento Total Calculado: <strong style={{ fontSize: '1.2em' }}>R$ {success.totalCost ? success.totalCost.toFixed(2) : '---'}</strong></p>
                    <p style={{ fontSize: '0.8em' }}>Você pode ver esta reserva na Agenda.</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <label htmlFor="userId">Cliente:</label>
                <select
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                    disabled={isDataLoading}
                >
                    {isDataLoading && <option value="">Carregando clientes...</option>}
                    {users.length === 0 && !isDataLoading && <option value="">Nenhum cliente encontrado...</option>}
                    {users.map(user => (
                        <option key={user._id} value={user._id}>
                            {user.name} ({user.email})
                        </option>
                    ))}
                </select>

                <p className="alert-info" style={{ marginBottom: '20px' }}>
                    Cliente não cadastrado? <Link to="/users/new" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Cadastre um novo cliente aqui</Link> antes de continuar.
                </p>

                <label htmlFor="spaceId">Espaço a Reservar:</label>
                <select
                    id="spaceId"
                    name="spaceId"
                    value={formData.spaceId}
                    onChange={handleChange}
                    required
                    disabled={isDataLoading || spaces.length === 0}
                >
                    {isDataLoading && <option value="">Carregando espaços...</option>}
                    {spaces.length === 0 && !isDataLoading ? (
                        <option value="">Nenhum espaço cadastrado</option>
                    ) : (
                        spaces.map(space => (
                            <option key={space._id} value={space._id}>
                                {space.name} (R$ {space.pricePerHour ? space.pricePerHour.toFixed(2) : '0.00'}/h)
                            </option>
                        ))
                    )}
                </select>

                <label htmlFor="start">Início da Reserva:</label>
                <input
                    id="start"
                    type="datetime-local"
                    name="start"
                    value={formData.start}
                    onChange={handleChange}
                    required
                    disabled={isDataLoading}
                />

                <label htmlFor="end">Fim da Reserva:</label>
                <input
                    id="end"
                    type="datetime-local"
                    name="end"
                    value={formData.end}
                    onChange={handleChange}
                    required
                    disabled={isDataLoading}
                />

                <button type="submit" disabled={isDataLoading || spaces.length === 0}>
                    {loading ? 'Reservando...' : 'Reservar e Calcular Orçamento'}
                </button>
            </form>
        </div>
    );
}

export default CreateReservation;