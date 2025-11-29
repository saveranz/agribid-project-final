import api from './axios';

// Get my active bids
export const getMyBids = async () => {
    return api.get('/api/v1/bids');
};

// Place a bid
export const placeBid = async (listingId, bidAmount) => {
    return api.post('/api/v1/bids', {
        listing_id: listingId,
        bid_amount: bidAmount
    });
};
