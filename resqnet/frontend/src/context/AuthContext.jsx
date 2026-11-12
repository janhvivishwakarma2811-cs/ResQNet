import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('resqnet_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('resqnet_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(prev => ({ ...prev, ...res.data }));
          localStorage.setItem('resqnet_user', JSON.stringify({ ...user, ...res.data }));
        } catch (err) {
          console.warn('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const authData = response.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('resqnet_token', authData.token);
    localStorage.setItem('resqnet_user', JSON.stringify(authData));
    return authData;
  };

  const register = async (formData) => {
    const response = await api.post('/auth/register', formData);
    const authData = response.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('resqnet_token', authData.token);
    localStorage.setItem('resqnet_user', JSON.stringify(authData));
    return authData;
  };

  const demoLogin = async (roleType) => {
    let username = 'citizen';
    let password = 'Citizen@123';
    if (roleType === 'RESPONDER') {
      username = 'responder@resqnet.org';
      password = 'Responder@123';
    } else if (roleType === 'ADMIN') {
      username = 'admin@resqnet.org';
      password = 'Admin@123';
    }
    return await login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('resqnet_token');
    localStorage.removeItem('resqnet_user');
  };

  const isCitizen = user?.role === 'ROLE_CITIZEN';
  const isResponder = user?.role === 'ROLE_RESPONDER';
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        isAuthenticated: !!token,
        isCitizen,
        isResponder,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
