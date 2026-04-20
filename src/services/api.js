import axios from 'axios';

const API = axios.create({
  baseURL: 'https://taskflow-api-production-e087.up.railway.app/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => API.post('/Auth/register', data);
export const login = (data) => API.post('/Auth/login', data);
export const getTasks = () => API.get('/Tasks');
export const createTask = (data) => API.post('/Tasks', data);
export const updateTask = (id, data) => API.put(`/Tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/Tasks/${id}`);