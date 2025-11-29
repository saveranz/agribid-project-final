import api from './axios';

/**
 * Get payment status and history for a specific bid
 */
export const getPaymentStatus = async (bidId) => {
  const response = await api.get(`/bids/${bidId}/payment-status`);
  return response.data;
};

/**
 * Submit a payment for a winning bid
 */
export const submitPayment = async (paymentData) => {
  const formData = new FormData();
  formData.append('bid_id', paymentData.bid_id);
  formData.append('amount', paymentData.amount);
  formData.append('payment_type', paymentData.payment_type);
  formData.append('payment_method', paymentData.payment_method);
  
  if (paymentData.payment_reference) {
    formData.append('payment_reference', paymentData.payment_reference);
  }
  
  if (paymentData.payment_proof) {
    formData.append('payment_proof', paymentData.payment_proof);
  }
  
  if (paymentData.notes) {
    formData.append('notes', paymentData.notes);
  }

  const response = await api.post('/auction-payments', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get buyer's payment history across all auctions
 */
export const getBuyerPayments = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.payment_type) params.append('payment_type', filters.payment_type);
  
  const response = await api.get(`/auction-payments/buyer?${params.toString()}`);
  return response.data;
};

/**
 * Get all payments for a specific bid
 */
export const getPaymentsByBid = async (bidId) => {
  const response = await api.get(`/auction-payments/bid/${bidId}`);
  return response.data;
};

/**
 * Get single payment details
 */
export const getPaymentDetails = async (paymentId) => {
  const response = await api.get(`/auction-payments/${paymentId}`);
  return response.data;
};
