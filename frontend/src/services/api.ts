import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request: agrega token si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función para limpiar el token de localStorage y headers de Axios
export const clearAuthToken = () => {
  localStorage.removeItem('access_token');
  delete api.defaults.headers.common['Authorization'];
};

// Rutas públicas que no deben redirigir en caso de 401
const publicRoutes = ['/auth/login', '/auth/register'];

// Interceptor response: maneja 401 solo en rutas protegidas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Verificar si es 401 y NO es una ruta pública
    if (error.response?.status === 401) {
      const isPublicRoute = publicRoutes.some(route => 
        originalRequest.url?.includes(route)
      );
      
      if (!isPublicRoute) {
        // Eliminar token y redirigir solo en rutas protegidas
        clearAuthToken();
        // Disparar evento para notificar al AuthContext
        window.dispatchEvent(new CustomEvent('auth:logout'));
        window.location.href = '/';
      }
    } else if (error.response?.status === 403) {
      window.location.href = '/unauthorized';
    }
    
    return Promise.reject(error);
  }
);

export default api;
