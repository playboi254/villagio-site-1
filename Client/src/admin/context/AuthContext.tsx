import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/admin/lib/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  userType: 'admin';
  avatar?: string;
  phone?: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  updateAdmin: (updates: Partial<AdminUser>) => void;
  logout: () => void;
}

export const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      api.get('/auth/profile')
        .then(res => {
          if (res.data.user?.userType === 'admin') {
            setAdmin(res.data.user);
          } else {
            localStorage.removeItem('admin_token');
          }
        })
        .catch(() => localStorage.removeItem('admin_token'))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.user?.userType !== 'admin') {
      throw new Error('Access denied. Admin accounts only.');
    }
    localStorage.setItem('admin_token', res.data.token);
    setAdmin(res.data.user);
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem('admin_token');
  }, []);

  const updateAdmin = useCallback((updates: Partial<AdminUser>) => {
    setAdmin(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, isAuthenticated: !!admin, isLoading, login, logout, updateAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Hook moved to a separate file to satisfy fast-refresh rule