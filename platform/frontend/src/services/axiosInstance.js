import axios from 'axios';
import { getAuthToken, getRefreshToken, setAuthToken } from './auth';
import { message } from 'antd';

const axiosInstance = axios.create({
  baseURL: '/api/',
  timeout: 10000000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post('/api/api/auth/refresh', {
          refresh_token: getRefreshToken(),
        });

        const newAccessToken = refreshRes.data.access_token;
        const newRefreshToken = refreshRes.data.refresh_token;

        setAuthToken(newAccessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        message.error('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
