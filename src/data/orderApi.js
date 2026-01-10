import apiClient from './apiClient';

// === CART OPERATIONS ===

export const getCart = async () => {
  const response = await apiClient.get('/api/orders/cart');
  return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await apiClient.post('/api/orders/cart', {
    productId,
    quantity
  });
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await apiClient.put('/api/orders/cart', {
    productId,
    quantity
  });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await apiClient.delete(`/api/orders/cart/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await apiClient.delete('/api/orders/cart');
  return response.data;
};

// === ORDER OPERATIONS ===

export const placeOrder = async (items, discountCode = null) => {
  const response = await apiClient.post('/api/orders', {
    items,
    discountCode
  });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await apiClient.get('/api/orders');
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await apiClient.get(`/api/orders/${orderId}`);
  return response.data;
};

// === ADMIN OPERATIONS ===

export const getAllOrders = async () => {
  const response = await apiClient.get('/api/orders/all');
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await apiClient.patch(`/api/orders/${orderId}/status`, {
    status
  });
  return response.data;
};
