import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'https://employee-management-system-sbvn.onrender.com';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://employee-management-system-sbvn.onrender.com/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
