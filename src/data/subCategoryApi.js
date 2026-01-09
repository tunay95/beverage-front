import apiClient from './apiClient';

export const getAllSubCategories = async () => {
  const response = await apiClient.get('/api/subcategories');
  return response.data;
};

export const getAllActiveSubCategories = async () => {
  const response = await apiClient.get('/api/subcategories/active');
  return response.data;
};

export const getAllDeletedSubCategories = async () => {
  const response = await apiClient.get('/api/subcategories/deleted');
  return response.data;
};

export const getSubCategoryById = async (id) => {
  const response = await apiClient.get(`/api/subcategories/${id}`);
  return response.data;
};

export const createSubCategory = async (dto) => {
  const response = await apiClient.post('/api/subcategories', dto);
  return response.data;
};

export const updateSubCategory = async (id, dto) => {
  const response = await apiClient.put(`/api/subcategories/${id}`, dto);
  return response.data;
};

export const deleteSubCategory = async (id) => {
  const response = await apiClient.delete(`/api/subcategories/${id}`);
  return response.data;
};

export const softDeleteSubCategory = async (id) => {
  const response = await apiClient.delete(`/api/subcategories/${id}/soft`);
  return response.data;
};

export const recoverSubCategory = async (id) => {
  const response = await apiClient.patch(`/api/subcategories/${id}/recover`);
  return response.data;
};

export const activateSubCategory = async (id) => {
  const response = await apiClient.patch(`/api/subcategories/${id}/activate`);
  return response.data;
};

export const deactivateSubCategory = async (id) => {
  const response = await apiClient.patch(`/api/subcategories/${id}/deactivate`);
  return response.data;
};

export const getSubCategoriesByCategory = async (categoryId) => {
  const response = await apiClient.get(`/api/subcategories/by-category/${categoryId}`);
  return response.data;
};
