import api from './axios';

// Get cart items
export const getCart = async () => {
    return api.get('/api/v1/cart');
};

// Add item to cart
export const addToCart = async (data) => {
    return api.post('/api/v1/cart', data);
};

// Update cart item quantity
export const updateCartItem = async (id, quantity) => {
    return api.put(`/api/v1/cart/${id}`, { quantity });
};

// Remove item from cart
export const removeFromCart = async (id) => {
    return api.delete(`/api/v1/cart/${id}`);
};

// Clear entire cart
export const clearCart = async () => {
    return api.delete('/api/v1/cart');
};
