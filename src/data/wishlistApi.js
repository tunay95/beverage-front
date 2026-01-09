import apiClient from './apiClient';

export const getMyWishlist = async () => {
  const response = await apiClient.get('/api/wishlists');
  return response.data;
};

export const getWishlistCount = async () => {
  const response = await apiClient.get('/api/wishlists/count');
  return response.data;
};

export const isInWishlist = async (productId) => {
  const response = await apiClient.get(`/api/wishlists/check/${productId}`);
  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await apiClient.post('/api/wishlists', { productId });
  return response.data;
};

export const removeFromWishlist = async (wishlistId) => {
  const response = await apiClient.delete(`/api/wishlists/${wishlistId}`);
  return response.data;
};

export const removeByProductId = async (productId) => {
  const response = await apiClient.delete(`/api/wishlists/product/${productId}`);
  return response.data;
};

export const clearWishlist = async () => {
  const response = await apiClient.delete('/api/wishlists');
  return response.data;
};
