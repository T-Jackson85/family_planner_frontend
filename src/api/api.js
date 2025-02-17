import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Ensure this points to your backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token && Date.now() >= tokenExpiry) {
      // Token has expired, get a new one using the refresh token
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:5000/api/auth/refresh', { token: refreshToken });
        token = response.data.accessToken;
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiry', Date.now() + 15 * 60 * 1000); // 15 minutes
      } catch (error) {
        console.error('Failed to refresh token', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
        throw error;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;