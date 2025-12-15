import React, { useEffect, useState } from 'react';
import { getReservations, deleteReservation } from '../../services/api';

function ReservationAgenda() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const fetchReservations = async () => {
        try {
            const data = await getReservations();
            setReservations(data);
            setError(null);
        } catch (err) {
            setError('Não foi possível carregar a Agenda de Reservas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleDelete = async (reservationId) => {
        if (!window.confirm(`Tem certeza que deseja DELETAR esta reserva? Esta ação é irreversível.`)) {
            return;
        }

        try {
            await deleteReservation(reservationId);

            setReservations(reservations.filter(res => res._id !== reservationId));

            setMessage('Reserva deletada com sucesso!');
            setError(null);

        } catch (err) {
            const errorMessage = err?.message || 'Falha na comunicação com o servidor.';
            setError('Erro ao deletar a reserva: ' + errorMessage);
            setMessage(null);
        }
    };

    if (loading) return <h2>Carregando Agenda...</h2>;

    return (
        <div className="reservation-agenda-container">
            <h1>Agenda de Reservas Confirmadas</h1>

            {error && <p className="alert-error">{error}</p>}
            {message && <p className="alert-success">{message}</p>}

            {reservations.length === 0 && <p className="alert-info">Nenhuma reserva encontrada.</p>}

            <div className="reservation-list">
                {reservations.map(res => (
                    <div key={res._id} className="reservation-card">

                        <h3>Reserva # {res._id.substring(18)}</h3>

                        <p><strong>Espaço:</strong> {res.spaceId?.name || 'Espaço Desconhecido'}</p>
                        <p><strong>Cliente:</strong> {res.userId?.name || 'Cliente Desconhecido'}</p>

                        <p><strong>Início:</strong> {formatDateTime(res.start)}</p>
                        <p><strong>Fim:</strong> {formatDateTime(res.end)}</p>

                        <p style={{ fontWeight: 'bold' }}>
                            Custo Total: R$ {res.totalCost ? res.totalCost.toFixed(2) : '0.00'}
                        </p>

                        <button
                            onClick={() => handleDelete(res._id)}
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                padding: '10px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '15px'
                            }}
                        >
                            Deletar Reserva
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReservationAgenda;