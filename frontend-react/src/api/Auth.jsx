import api from './axios';

export const login = async (email, password) => {
    return api.post('/api/v1/login', { email, password });
};

export const register = async (data) => {
    return api.post('/api/v1/register', data);
};

export const logout = async () => {
    return api.post('/api/v1/logout');
};

export const getCurrentUser = async () => {
    return api.get('/api/v1/user');
};
