import apiClient from './apiClient';

// Initiate payment with Kapital Bank
// Backend will create order and initiate payment
export const initiatePayment = async (items, discountCode = "") => {
  const response = await apiClient.post('/api/payments/initiate', {
    items,
    discountCode
  });
  return response.data;
};

// Handle payment callback from Kapital Bank
export const handlePaymentCallback = async (providerTransactionId, status) => {
  const response = await apiClient.post('/api/payments/callback', {
    providerTransactionId,
    status
  });
  return response.data;
};

// Get payment status
export const getPaymentStatus = async (transactionId) => {
  const response = await apiClient.get(`/api/payments/status/${transactionId}`);
  return response.data;
};
