import apiClient from './apiClient';

export const getAllSlides = async () => {
  const response = await apiClient.get('/api/slides');
  return response.data;
};

export const getSlideById = async (id) => {
  const response = await apiClient.get(`/api/slides/${id}`);
  return response.data;
};

export const createSlide = async (formData) => {
  const response = await apiClient.post('/api/slides', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateSlide = async (id, formData) => {
  const response = await apiClient.put(`/api/slides/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteSlide = async (id) => {
  const response = await apiClient.delete(`/api/slides/${id}`);
  return response.data;
};

export const softDeleteSlide = async (id) => {
  const response = await apiClient.delete(`/api/slides/${id}/soft`);
  return response.data;
};

export const recoverSlide = async (id) => {
  const response = await apiClient.patch(`/api/slides/${id}/recover`);
  return response.data;
};

export const activateSlide = async (id) => {
  const response = await apiClient.patch(`/api/slides/${id}/activate`);
  return response.data;
};

export const deactivateSlide = async (id) => {
  const response = await apiClient.patch(`/api/slides/${id}/deactivate`);
  return response.data;
};
