import apiClient from './apiClient';

export const getAllProductDetails = async () => {
  const response = await apiClient.get('/api/productdetails');
  return response.data;
};

export const getProductDetailsById = async (id) => {
  const response = await apiClient.get(`/api/productdetails/${id}`);
  return response.data;
};

export const getProductDetailsByProductId = async (productId) => {
  const response = await apiClient.get(`/api/productdetails/product/${productId}`);
  return response.data;
};

export const createProductDetails = async (dto) => {
  const response = await apiClient.post('/api/productdetails', dto);
  return response.data;
};

export const updateProductDetails = async (id, dto) => {
  const response = await apiClient.put(`/api/productdetails/${id}`, dto);
  return response.data;
};

export const deleteProductDetails = async (id) => {
  const response = await apiClient.delete(`/api/productdetails/${id}`);
  return response.data;
};

export const softDeleteProductDetails = async (id) => {
  const response = await apiClient.delete(`/api/productdetails/${id}/soft`);
  return response.data;
};

export const recoverProductDetails = async (id) => {
  const response = await apiClient.patch(`/api/productdetails/${id}/recover`);
  return response.data;
};

export const activateProductDetails = async (id) => {
  const response = await apiClient.patch(`/api/productdetails/${id}/activate`);
  return response.data;
};

export const deactivateProductDetails = async (id) => {
  const response = await apiClient.patch(`/api/productdetails/${id}/deactivate`);
  return response.data;
};
