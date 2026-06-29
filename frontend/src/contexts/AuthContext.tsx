import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, getMe } from '../services/auth.service';
import { clearAuthToken } from '../services/api';
import { logger } from '@/utils/logger';
interface User {
  [key: string]: any;
}
interface AuthContextType {
  user: User | null;
  login: (email: string, contraseña: string, codigoEmpresa: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        try {
          const currentUser = await getMe();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          clearAuthToken();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    initAuth();
  }, []);
  const login = async (email: string, contraseña: string, codigoEmpresa: string) => {
    logger.log('AuthContext.login llamado con:', { email, codigoEmpresa });
    const response = await loginService(email, contraseña, codigoEmpresa);
    logger.log('Respuesta completa del login:', response);
    
    // El backend envuelve la respuesta en {success: true, data: {token, refreshToken, usuario}}
    // Por lo tanto el token está en response.data.data.token
    // Intentar múltiples estructuras posibles para mayor robustez
    const token = response?.data?.data?.token || 
                  response?.data?.token || 
                  response?.token ||
                  response?.access_token;
    
    if (token) {
      localStorage.setItem('access_token', token);
      
      // El usuario ya viene en la respuesta, no necesitamos llamar a getMe
      const usuario = response?.data?.data?.usuario || response?.data?.usuario || response?.usuario;
      logger.log('Usuario obtenido de la respuesta:', usuario);
      setUser(usuario);
      setIsAuthenticated(true);
    } else {
      logger.error('No se recibió token en la respuesta');
      logger.error('Estructura completa de response:', JSON.stringify(response, null, 2));
    }
  };
  const logout = () => {
    logger.log('AuthContext.logout: Limpiando tokens y estado local');
    clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
    console.log('AuthContext.logout: Redirigiendo a /');
    window.location.href = '/';
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
