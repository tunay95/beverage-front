import apiClient from './apiClient';

// Get transactions with filter
export const getTransactionsWithFilter = async (filter) => {
  const response = await apiClient.post('/api/transactions/filter', filter);
  return response.data;
};

// Get transaction statistics
export const getTransactionStats = async () => {
  const response = await apiClient.get('/api/transactions/stats');
  return response.data;
};

// Get transaction by ID
export const getTransactionById = async (id) => {
  const response = await apiClient.get(`/api/transactions/${id}`);
  return response.data;
};

// Get transactions by order ID
export const getTransactionsByOrder = async (orderId) => {
  const response = await apiClient.get(`/api/transactions/order/${orderId}`);
  return response.data;
};

// Get transactions by user ID
export const getTransactionsByUser = async (userId) => {
  const response = await apiClient.get(`/api/transactions/user/${userId}`);
  return response.data;
};

// Update transaction status
export const updateTransactionStatus = async (id, status) => {
  const response = await apiClient.patch(`/api/transactions/${id}/status`, {
    status
  });
  return response.data;
};

// Transaction status enum
export const TransactionStatus = {
  Pending: 0,
  Processing: 1,
  Completed: 2,
  Failed: 3,
  Cancelled: 4
};

// Status display names
export const TransactionStatusNames = {
  0: 'Pending',
  1: 'Processing',
  2: 'Completed',
  3: 'Failed',
  4: 'Cancelled'
};
