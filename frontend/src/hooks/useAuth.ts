import { useRecoilState } from 'recoil';
import { useCallback } from 'react';
import { authState } from '../store/atoms';
import { authService, type LoginData, type RegisterData } from '../services/authService';
import { decodeJWT, isTokenExpired } from '../utils/jwt';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);  const login = useCallback(async (data: LoginData) => {
    setAuth(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await authService.login(data);
      authService.setToken(response.token);
      
      const payload = decodeJWT(response.token);
      const user = payload ? { id: payload.id, username: payload.username } : { id: 'user-id', username: data.username };
      
      setAuth({
        isAuthenticated: true,
        user,
        token: response.token,
        loading: false,
      });
      
      return response;
    } catch (error) {
      setAuth(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [setAuth]);  const register = useCallback(async (data: RegisterData) => {
    setAuth(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await authService.register(data);
      authService.setToken(response.token);
      
      const payload = decodeJWT(response.token);
      const user = payload ? { id: payload.id, username: payload.username } : { id: 'user-id', username: data.username };
      
      setAuth({
        isAuthenticated: true,
        user,
        token: response.token,
        loading: false,
      });
      
      return response;
    } catch (error) {
      setAuth(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [setAuth]);
  const logout = useCallback(() => {
    authService.removeToken();
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
    });
  }, [setAuth]);  const initializeAuth = useCallback(() => {
    const token = authService.getToken();
    if (token && !isTokenExpired(token)) {
      const payload = decodeJWT(token);
      const user = payload ? { id: payload.id, username: payload.username } : null;
      
      if (user) {
        setAuth(prev => ({
          ...prev,
          isAuthenticated: true,
          token: token,
          user,
        }));
      } else {
        // Invalid token, remove it
        authService.removeToken();
      }
    } else {
      // Token expired or doesn't exist, clear it
      authService.removeToken();
    }
  }, [setAuth]);

  return {
    auth,
    login,
    register,
    logout,
    initializeAuth,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
  };
};
