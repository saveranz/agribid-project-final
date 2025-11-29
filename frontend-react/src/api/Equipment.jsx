import api from './axios';

// Get all equipment
export const getEquipment = async () => {
    return api.get('/api/v1/equipment');
};

// Get available equipment only
export const getAvailableEquipment = async () => {
    return api.get('/api/v1/equipment', {
        params: { status: 'available' }
    });
};

// Rent equipment
export const rentEquipment = async (equipmentId, rentalData) => {
    return api.post(`/api/v1/equipment/${equipmentId}/rent`, rentalData);
};
