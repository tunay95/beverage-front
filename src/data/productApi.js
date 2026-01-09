import apiClient from './apiClient';

export const getAllProducts = async () => {
  const response = await apiClient.get('/api/products');
  return response.data;
};

export const getFilterOptions = async () => {
  const response = await apiClient.get('/api/products/filter-options');
  return response.data;
};

export const getShopProducts = async (filterDto) => {
  const response = await apiClient.post('/api/products/filter', filterDto);
  return response.data;
};

export const getAllActiveProducts = async () => {
  const response = await apiClient.get('/api/products/active');
  return response.data;
};

export const getAllDeletedProducts = async () => {
  const response = await apiClient.get('/api/products/deleted');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/api/products/${id}`);
  return response.data;
};

export const getProductDetailed = async (id) => {
  const response = await apiClient.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (dto) => {
  // dto should be FormData for file upload
  const response = await apiClient.post('/api/products', dto, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProduct = async (id, dto) => {
  // dto should be FormData for file upload
  const response = await apiClient.put(`/api/products/${id}`, dto, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/api/products/${id}`);
  return response.data;
};

export const softDeleteProduct = async (id) => {
  const response = await apiClient.delete(`/api/products/${id}/soft`);
  return response.data;
};

export const recoverProduct = async (id) => {
  const response = await apiClient.patch(`/api/products/${id}/recover`);
  return response.data;
};

export const activateProduct = async (id) => {
  const response = await apiClient.patch(`/api/products/${id}/activate`);
  return response.data;
};

export const deactivateProduct = async (id) => {
  const response = await apiClient.patch(`/api/products/${id}/deactivate`);
  return response.data;
};
