import api from './axios';

// Get notifications
export const getNotifications = async () => {
    return api.get('/api/v1/notifications');
};

// Mark notification as read
export const markNotificationAsRead = async (id) => {
    return api.post(`/api/v1/notifications/${id}/read`);
};

// Get unread count
export const getUnreadCount = async () => {
    const response = await api.get('/api/v1/notifications');
    return response.data.data.filter(n => !n.is_read).length;
};
