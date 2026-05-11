"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/auth';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  refreshUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within SessionProvider');
  }
  return context;
};

function getCachedUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('userData');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function SessionProvider({ children }) {
  const hasToken = typeof window !== 'undefined' ? !!authService.getToken() : false;
  const cached = hasToken ? getCachedUser() : null;

  const [user, setUser] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [isAuthenticated, setIsAuthenticated] = useState(!!cached);

  const refreshUser = async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(!!userData);
    } catch {
      const fallback = getCachedUser();
      if (fallback) {
        setUser(fallback);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
