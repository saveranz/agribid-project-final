import api from './axios';

// Get all listings
export const getListings = async (params = {}) => {
    return api.get('/api/v1/listings', { params });
};

// Get single listing
export const getListing = async (id) => {
    return api.get(`/api/v1/listings/${id}`);
};

// Get flash deals
export const getFlashDeals = async () => {
    return api.get('/api/v1/flash-deals');
};

// Get auction listings
export const getAuctionListings = async (params = {}) => {
    return api.get('/api/v1/auctions', { params });
};

// Get direct buy listings
export const getDirectBuyListings = async (params = {}) => {
    return api.get('/api/v1/direct-buy', { params });
};

// Search listings
export const searchListings = async (searchQuery) => {
    return api.get('/api/v1/listings', {
        params: { search: searchQuery }
    });
};

// Create new listing (Farmer)
export const createListing = async (formData) => {
    return api.post('/api/v1/listings', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Update listing (Farmer)
export const updateListing = async (id, formData) => {
    return api.post(`/api/v1/listings/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Delete listing (Farmer)
export const deleteListing = async (id) => {
    return api.delete(`/api/v1/listings/${id}`);
};

// Get farmer's own listings
export const getMyListings = async () => {
    return api.get('/api/v1/listings', {
        params: { my_listings: true }
    });
};

// Get bidders for a specific listing
export const getListingBidders = async (listingId) => {
    return api.get(`/api/v1/listings/${listingId}/bidders`);
};

// Get archived listings (Farmer)
export const getArchivedListings = async () => {
    return api.get('/api/v1/listings-archived');
};

// Restore archived listing (Farmer)
export const restoreListing = async (id) => {
    return api.post(`/api/v1/listings/${id}/restore`);
};

