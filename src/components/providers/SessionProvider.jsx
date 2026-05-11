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

export default function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshUser = async () => {
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(!!userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        
        // Check if it's a network error (backend might be down)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          // Network error - try to use cached data
          try {
            const cachedUser = localStorage.getItem('userData');
            if (cachedUser) {
              const user = JSON.parse(cachedUser);
              setUser(user);
              setIsAuthenticated(true);
              setLoading(false);
              return; // Don't remove token on network errors
            }
          } catch (e) {
            // Invalid cached data, continue to clear state
          }
        }
        
        // Only clear user state if it's not a network error
        // Don't remove token on network errors - might be temporary
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
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
