import api from './axios';

// Get all categories
export const getCategories = async () => {
    return api.get('/api/v1/categories');
};

// Get listings by category
export const getListingsByCategory = async (categoryId) => {
    return api.get('/api/v1/listings', {
        params: { category_id: categoryId }
    });
};
