export const getAuthToken = () => localStorage.getItem('token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setAuthToken = (accessToken, refreshToken) => {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};
