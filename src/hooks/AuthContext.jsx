import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../data/authApi';
import { getToken, setToken, clearToken } from '../data/tokenStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userSummary, setUserSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        setTokenState(storedToken);
        setIsAuthenticated(true);
        await loadUserSummary(storedToken);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loadUserSummary = async (tokenOverride = null) => {
    try {
      setError(null);
      const summary = await authApi.getUserSummary(tokenOverride);
      setUserSummary(summary);
      return summary;
    } catch (err) {
      console.error('Failed to load user summary:', err);
      setError(err.response?.data?.message || 'Failed to load user data');
      // If token is invalid, clear it
      if (err.response?.status === 401) {
        logout(true);
      }
      throw err;
    }
  };

  const login = async (dto) => {
    try {
      setError(null);
      const response = await authApi.login(dto);
      
      if (response.token) {
        setToken(response.token);
        setTokenState(response.token);
        setIsAuthenticated(true);
        
        // Load user summary after login
        await loadUserSummary(response.token);
        
        return response;
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Login failed:', err);
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const register = async (dto) => {
    try {
      setError(null);
      const response = await authApi.register(dto);
      return response;
    } catch (err) {
      console.error('Registration failed:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = (redirectToLogin = false) => {
    clearToken();
    setTokenState(null);
    setIsAuthenticated(false);
    setUserSummary(null);
    setError(null);
    if (redirectToLogin) {
      window.location.href = '/auth/login';
    }
  };

  const checkAuthorize = async () => {
    try {
      setError(null);
      const response = await authApi.checkAuthorize();
      return response;
    } catch (err) {
      console.error('Authorization check failed:', err);
      setError(err.response?.data?.message || 'Authorization failed');
      throw err;
    }
  };

  const value = {
    token,
    isAuthenticated,
    userSummary,
    loading,
    error,
    login,
    register,
    logout,
    loadUserSummary,
    checkAuthorize,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
