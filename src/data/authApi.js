import apiClient from './apiClient';
import { getToken } from './tokenStorage';

export const register = async (dto) => {
  const response = await apiClient.post('/api/auths/register', dto);
  return response.data;
};

export const login = async (dto) => {
  const response = await apiClient.post('/api/auths/login', dto);
  return response.data;
};

export const checkAuthorize = async () => {
  const response = await apiClient.get('/api/auths/check-authorize');
  return response.data;
};

export const getUserSummary = async (tokenOverride = null) => {
  const token = tokenOverride || getToken();
  const response = await apiClient.post('/api/auths/get-user-summary', {
    jwtTokenString: token,
  });
  return response.data;
};
