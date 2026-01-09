import apiClient from './apiClient';

export const getAllCategories = async () => {
  const response = await apiClient.get('/api/categories');
  return response.data;
};

export const getAllActiveCategories = async () => {
  const response = await apiClient.get('/api/categories/active');
  return response.data;
};

export const getAllDeletedCategories = async () => {
  const response = await apiClient.get('/api/categories/deleted');
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await apiClient.get(`/api/categories/${id}`);
  return response.data;
};

export const createCategory = async (dto) => {
  const response = await apiClient.post('/api/categories', dto);
  return response.data;
};

export const updateCategory = async (id, dto) => {
  const response = await apiClient.put(`/api/categories/${id}`, dto);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/api/categories/${id}`);
  return response.data;
};

export const softDeleteCategory = async (id) => {
  const response = await apiClient.delete(`/api/categories/${id}/soft`);
  return response.data;
};

export const recoverCategory = async (id) => {
  const response = await apiClient.patch(`/api/categories/${id}/recover`);
  return response.data;
};

export const activateCategory = async (id) => {
  const response = await apiClient.patch(`/api/categories/${id}/activate`);
  return response.data;
};

export const deactivateCategory = async (id) => {
  const response = await apiClient.patch(`/api/categories/${id}/deactivate`);
  return response.data;
};
