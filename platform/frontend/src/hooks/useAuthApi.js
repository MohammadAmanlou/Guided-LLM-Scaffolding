import axiosInstance from "../services/axiosInstance";
export const useAuthApi = () => {
  return {
    login: (username, password) =>
      axiosInstance.post('api/auth/login', { username, password }),

    signup: (username, password, first_name, last_name, role) =>
      axiosInstance.post('api/auth/register', {
        username, password, first_name, last_name, role
      }),

    logout: (refreshToken) =>
      axiosInstance.post('api/auth/logout', {
        refresh_token: refreshToken,
      }),


    changePassword: (username, old_password, new_password) =>
      axiosInstance.post('api/auth/change_password', {
        username,
        old_password,
        new_password,
      }),
    refreshToken: (refreshT)=> axiosInstance.post('api/auth/refresh', {
      refresh_token:refreshT
    }),
  };
};


