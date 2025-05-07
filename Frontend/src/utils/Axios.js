import axios from "axios";
import SummaryApi from "../common/SummaryApi";

// Get the backend URL from environment variable or use a default
const baseURL = import.meta.env.VITE_BACKEND_URL || 'https://quicko-app-backend.onrender.com';

console.log('Backend URL:', baseURL); // Debug log

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Sending access token in the header
Axios.interceptors.request.use(
  async (config) => {
    console.log('Making request to:', config.url); // Debug log
    
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Remove body for GET requests
    if (config.method === 'get') {
      delete config.data;
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error); // Debug log
    return Promise.reject(error);
  }
);

// Handle response and errors
Axios.interceptors.response.use(
  async (response) => {
    console.log('Response received:', response.status); // Debug log
    return response;
  },
  async (error) => {
    console.error('Response error:', error.response?.status, error.response?.data); // Debug log
    
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return Axios(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
    }
    
    // Handle 405 Method Not Allowed
    if (error.response?.status === 405) {
      console.error('Method not allowed:', error.config.method, error.config.url);
    }
    
    return Promise.reject(error);
  }
);

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await Axios({
      ...SummaryApi.refreshToken,
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const accessToken = response.data.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export default Axios;