import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthApi } from '../hooks/useAuthApi';
import { parseJwt, isTokenExpired } from '../utils/jwt';
import axiosInstance from '../services/axiosInstance';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { login: apiLogin, signup: apiSignup, logout: apiLogout, refreshToken: apiRefreshToken } = useAuthApi();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshAccessToken = async (refreshToken) => {
    try {
      const res = await apiRefreshToken(refreshToken);

      const newToken = res.data.access_token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
    } catch (err) {
      console.warn('خطا در تمدید توکن. خروج انجام می‌شود.');
      await logout();
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (storedUser && storedToken && refreshToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);

      // if (isTokenExpired(storedToken)) {
      //   refreshAccessToken(refreshToken);
      // }

      // const interval = setInterval(() => {
      //   const currentToken = localStorage.getItem('token');
      //   const currentRefresh = localStorage.getItem('refresh_token');

      //   if (currentToken && currentRefresh && isTokenExpired(currentToken)) {
      //     refreshAccessToken(currentRefresh);
      //   }
      // }, 5 * 1 * 1000);

      // return () => clearInterval(interval);
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(username, password);

      if (res.data[1]) {
        if (res.data[0].change_password_required) {
          localStorage.setItem('temp_user', JSON.stringify({ username }));
          window.location.href = '/change-password';
          return;
        }
      }


      const userData = { username: res.data.username, first_name: res.data.first_name, last_name: res.data.last_name };
      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;

      setUser(userData);
      setToken(accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, password, first_name, last_name, role) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiSignup(username, password, first_name, last_name, role);
      const userData = { username: res.data.username };
      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;

      setUser(userData);
      setToken(accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ثبت‌نام');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } catch (err) {
      console.warn('خطا در logout از سرور، پاک‌سازی محلی انجام شد');
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
