import React, { useEffect, useState } from 'react';
import { getSpaces, deleteSpace } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function SpaceList() {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    const fetchSpaces = async () => {
        try {
            const data = await getSpaces();
            setSpaces(data);
        } catch (err) {
            setError('Não foi possível carregar a lista de espaços.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpaces();
    }, []);

    const handleDelete = async (spaceId, spaceName) => {
        if (!window.confirm(`Tem certeza que deseja DELETAR o espaço: "${spaceName}"? Esta ação é irreversível.`)) {
            return;
        }

        try {
            await deleteSpace(spaceId);
            setSpaces(spaces.filter(space => space._id !== spaceId));
            setMessage(`Espaço "${spaceName}" deletado com sucesso!`);
            setError(null);
        } catch (err) {
            setError('Erro ao deletar o espaço. Verifique se ele possui reservas ativas.');
            setMessage(null);
        }
    };

    const handleEdit = (spaceId) => {
        alert(`Implementar edição para o Espaço ID: ${spaceId}`);
    };

    if (loading) return <p className="alert-info">Carregando Espaços...</p>;
    if (error) return <p className="alert-error">{error}</p>;

    return (
        <div className="space-list-page">

            <div className="hero-banner">
                <div className="hero-content">
                    <h1>Agendamento de Espaços Inteligentes</h1>
                    <p>Encontre auditórios, salas de reunião e estúdios prontos para sua próxima ideia.</p>
                </div>
            </div>

            <h2>Nossos Espaços Disponíveis</h2>

            {message && <p className="alert-success">{message}</p>}

            {spaces.length === 0 && <p className="alert-info">Nenhum espaço cadastrado. Por favor, cadastre um novo espaço.</p>}

            <div className="space-list">
                {spaces.map(space => (
                    <div key={space._id} className="space-card">
                        <h3>{space.name}</h3>
                        <p>{space.description}</p>
                        <p><strong>Tipo:</strong> {space.type}</p>
                        <p><strong>Capacidade:</strong> {space.capacity} pessoas</p>
                        <p><strong>Valor/Hora:</strong> R$ {space.pricePerHour ? space.pricePerHour.toFixed(2) : '0.00'}</p>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button
                                onClick={() => handleDelete(space._id, space.name)}
                                style={{
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    flexGrow: 1
                                }}
                            >
                                Deletar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SpaceList;