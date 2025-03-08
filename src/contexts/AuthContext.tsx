"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  login as clientLogin, 
  register as clientRegister, 
  logout as clientLogout,
  fetchCurrentUser,
  User
} from '@/lib/auth/clientAuthUtils';

interface AuthContextType {
  user: User | null;
  loading: boolean; // Renamed from isLoading for consistency
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on initial render
  useEffect(() => {
    let isMounted = true;
    
    const loadUser = async () => {
      try {
        console.log("Fetching current user...");
        const userData = await fetchCurrentUser();
        
        // Only update state if the component is still mounted
        if (isMounted) {
          console.log("User data received:", userData ? "User found" : "No user");
          setUser(userData);
        }
      } catch (err) {
        console.error("Failed to load user", err);
        if (isMounted) {
          setError("Failed to authenticate");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUser();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await clientLogin(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      
      setError(result.error || 'Login failed');
      return false;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await clientRegister(name, email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      
      setError(result.error || 'Registration failed');
      return false;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const success = await clientLogout();
      if (success) {
        // Reset authentication state
        setUser(null);
      }
      return success;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);