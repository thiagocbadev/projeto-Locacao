import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../services/api';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setError('Não foi possível carregar a lista de clientes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Tem certeza que deseja DELETAR o cliente: "${userName}"?`)) {
            return;
        }

        try {
            await deleteUser(userId);

            setUsers(users.filter(user => user._id !== userId));
            setMessage(`Cliente "${userName}" deletado com sucesso!`);
            setError(null);
        } catch (err) {
            setError('Erro ao deletar o cliente. Verifique se ele possui reservas ativas.');
            setMessage(null);
        }
    };

    if (loading) return <p className="alert-info">Carregando Clientes...</p>;
    if (error) return <p className="alert-error">{error}</p>;

    return (
        <div className="user-list-page">

            <h1>Gerenciamento de Clientes</h1>

            {message && <p className="alert-success">{message}</p>}

            {users.length === 0 && <p className="alert-info">Nenhum cliente cadastrado.</p>}

            <div className="user-list space-list"> { }
                {users.map(user => (

                    <div key={user._id} className="user-card space-card" style={{ borderTopColor: '#5d5dff' }}>
                        <h3>{user.name}</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Telefone:</strong> {user.phone}</p>

                        { }
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button
                                onClick={() => handleDelete(user._id, user.name)}
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

export default UserList;