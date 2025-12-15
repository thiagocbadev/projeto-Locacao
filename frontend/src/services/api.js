import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3333',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getSpaces = async (filters = {}) => {
    try {
        const response = await api.get('/spaces', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar espaços:', error);
        throw error;
    }
};

export const createSpace = async (spaceData) => {
    try {
        const response = await api.post('/spaces', spaceData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar espaço:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Falha ao cadastrar o espaço.' };
    }
};

export const deleteSpace = async (spaceId) => {
    try {
        const response = await api.delete(`/spaces/${spaceId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar espaço:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Falha ao deletar o espaço.' };
    }
};


export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Falha ao cadastrar o usuário.' };
    }
};

export const getUsers = async () => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar usuário:', error.response?.data || error.message);
        throw error.response?.data || { message: 'Falha ao deletar o usuário.' };
    }
};


export const createReservation = async (reservationData) => {
    try {
        const response = await api.post('/reservations', reservationData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar reserva:', error.response?.data || error.message);
        const backendMessage = error.response?.data?.message || 'Falha ao processar a reserva.';
        throw { message: backendMessage };
    }
};

export const getReservations = async (filters = {}) => {
    try {
        const response = await api.get('/reservations', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        throw error;
    }
};

export const deleteReservation = async (reservationId) => {
    try {
        const response = await api.delete(`/reservations/${reservationId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar reserva:', error.response?.data || error.message);
        const backendMessage = error.response?.data?.message || 'Falha ao deletar a reserva.';
        throw { message: backendMessage };
    }
};

export default api;