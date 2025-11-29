import api from './axios';

// Get favorites
export const getFavorites = async () => {
    return api.get('/api/v1/favorites');
};

// Add to favorites
export const addFavorite = async (listingId) => {
    return api.post('/api/v1/favorites', {
        listing_id: listingId
    });
};

// Remove from favorites
export const removeFavorite = async (id) => {
    return api.delete(`/api/v1/favorites/${id}`);
};
