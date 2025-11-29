import api from './axios';

// Get my orders
export const getMyOrders = async () => {
    return api.get('/api/v1/my-orders');
};

// Get single transaction
export const getTransaction = async (id) => {
    return api.get(`/api/v1/transactions/${id}`);
};

// Create order (buy now)
export const createOrder = async (orderData) => {
    return api.post('/api/v1/transactions', orderData);
};
