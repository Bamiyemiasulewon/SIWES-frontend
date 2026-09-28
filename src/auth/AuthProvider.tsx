import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/client';
import type { CurrentUser, LoginPayload, RegisterPayload } from '../types';

type AuthContextValue = {
  user: CurrentUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('campus-service-desk-token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const savedToken = localStorage.getItem('campus-service-desk-token');
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<{ user: CurrentUser }>('/auth/me');
      const nextUser = response.data.user;
      setUser(nextUser);
      setToken(savedToken);
      localStorage.setItem('campus-service-desk-user', JSON.stringify(nextUser));
    } catch {
      localStorage.removeItem('campus-service-desk-token');
      localStorage.removeItem('campus-service-desk-user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const login = async (payload: LoginPayload) => {
    const response = await api.post<{ token: string; user: CurrentUser }>('/auth/login', payload);
    const nextToken = response.data.token;
    localStorage.setItem('campus-service-desk-token', nextToken);
    setToken(nextToken);
    setUser(response.data.user);
    localStorage.setItem('campus-service-desk-user', JSON.stringify(response.data.user));
  };

  const register = async (payload: RegisterPayload) => {
    const response = await api.post<{ token: string; user: CurrentUser }>('/auth/register', payload);
    const nextToken = response.data.token;
    localStorage.setItem('campus-service-desk-token', nextToken);
    setToken(nextToken);
    setUser(response.data.user);
    localStorage.setItem('campus-service-desk-user', JSON.stringify(response.data.user));
  };

  const logout = () => {
    localStorage.removeItem('campus-service-desk-token');
    localStorage.removeItem('campus-service-desk-user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, register, logout, refreshUser }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
