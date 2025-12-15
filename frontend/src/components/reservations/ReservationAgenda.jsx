import React, { useEffect, useState } from 'react';
import { getReservations, deleteReservation, updateReservation } from '../../services/api';

function ReservationAgenda() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [updating, setUpdating] = useState(false);

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

    const handleEdit = async (reservation) => {
        const currentStart = new Date(reservation.start);
        const currentEnd = new Date(reservation.end);

        const toLocalInput = (date) => {
            const pad = (n) => String(n).padStart(2, '0');
            const y = date.getFullYear();
            const m = pad(date.getMonth() + 1);
            const d = pad(date.getDate());
            const h = pad(date.getHours());
            const min = pad(date.getMinutes());
            return `${y}-${m}-${d}T${h}:${min}`;
        };

        const newStartStr = window.prompt(
            'Nova data/hora de INÍCIO (formato: AAAA-MM-DDTHH:MM)',
            toLocalInput(currentStart)
        );
        if (!newStartStr) return;

        const newEndStr = window.prompt(
            'Nova data/hora de FIM (formato: AAAA-MM-DDTHH:MM)',
            toLocalInput(currentEnd)
        );
        if (!newEndStr) return;

        const startIso = new Date(newStartStr).toISOString();
        const endIso = new Date(newEndStr).toISOString();

        setUpdating(true);
        try {
            const result = await updateReservation(reservation._id, {
                start: startIso,
                end: endIso,
            });

            const updatedReservation = result.reservation || result;

            setReservations((prev) =>
                prev.map((res) => (res._id === reservation._id ? updatedReservation : res))
            );

            setMessage('Reserva atualizada com sucesso!');
            setError(null);
        } catch (err) {
            const errorMessage = err?.message || 'Falha na comunicação com o servidor.';
            setError('Erro ao atualizar a reserva: ' + errorMessage);
            setMessage(null);
        } finally {
            setUpdating(false);
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

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button
                                onClick={() => handleEdit(res)}
                                disabled={updating}
                                style={{
                                    backgroundColor: '#0d6efd',
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    flexGrow: 1
                                }}
                            >
                                {updating ? 'Salvando...' : 'Editar Reserva'}
                            </button>
                            <button
                                onClick={() => handleDelete(res._id)}
                                disabled={updating}
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
                                Deletar Reserva
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReservationAgenda;