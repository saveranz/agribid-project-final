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

// Get farmer's own equipment
export const getMyEquipment = async () => {
    return api.get('/api/v1/my-equipment');
};

// Create new equipment
export const createEquipment = async (equipmentData) => {
    return api.post('/api/v1/equipment', equipmentData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Update equipment
export const updateEquipment = async (equipmentId, equipmentData) => {
    return api.post(`/api/v1/equipment/${equipmentId}?_method=PUT`, equipmentData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// Delete equipment
export const deleteEquipment = async (equipmentId) => {
    return api.delete(`/api/v1/equipment/${equipmentId}`);
};

// Rent equipment
export const rentEquipment = async (equipmentId, rentalData) => {
    return api.post(`/api/v1/equipment/${equipmentId}/rent`, rentalData);
};
