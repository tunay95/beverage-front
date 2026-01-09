import apiClient from './apiClient';

export const getAllProductFields = async () => {
  const response = await apiClient.get('/api/productfields');
  return response.data;
};

export const getProductFieldById = async (id) => {
  const response = await apiClient.get(`/api/productfields/${id}`);
  return response.data;
};

export const getProductFieldsByProductId = async (productId) => {
  const response = await apiClient.get(`/api/productfields/product/${productId}`);
  return response.data;
};

export const createProductField = async (dto) => {
  const response = await apiClient.post('/api/productfields', dto);
  return response.data;
};

export const updateProductField = async (id, dto) => {
  const response = await apiClient.put(`/api/productfields/${id}`, dto);
  return response.data;
};

export const deleteProductField = async (id) => {
  const response = await apiClient.delete(`/api/productfields/${id}`);
  return response.data;
};

export const softDeleteProductField = async (id) => {
  const response = await apiClient.delete(`/api/productfields/${id}/soft`);
  return response.data;
};

export const recoverProductField = async (id) => {
  const response = await apiClient.patch(`/api/productfields/${id}/recover`);
  return response.data;
};

export const activateProductField = async (id) => {
  const response = await apiClient.patch(`/api/productfields/${id}/activate`);
  return response.data;
};

export const deactivateProductField = async (id) => {
  const response = await apiClient.patch(`/api/productfields/${id}/deactivate`);
  return response.data;
};
