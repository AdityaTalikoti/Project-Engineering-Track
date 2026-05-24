import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
});

let logoutCallback = null;

export const registerLogoutCallback = (cb) => {
  logoutCallback = cb;
};

// Request interceptor to add Authorization header
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 Unauthorized responses
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (logoutCallback) {
        logoutCallback();
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
