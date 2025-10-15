import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing authentication on mount
  useEffect(() => {
    // For now, just set loading to false since we don't have session persistence
    // In a real app, you'd check for existing tokens/sessions here
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsLoading(false);
        return true;
      } else {
        setError(data.message || 'Login failed');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        return true;
      } else {
        setError(data.message || 'Signup failed');
        setIsLoading(false);
        return false;
      }
    } catch (err) {
      setError('An error occurred during signup');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // Clear the cookie by making a request to logout endpoint or manually removing it
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};