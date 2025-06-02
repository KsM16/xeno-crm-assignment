'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from '@/lib/types';
import LoadingSpinner from '@/components/shared/loading-spinner';


interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking auth status
    const storedUser = localStorage.getItem('clientpulse-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/login' || pathname === '/signup';
      if (!user && !isAuthPage) {
        router.push('/login');
      } else if (user && isAuthPage) {
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);


  const login = async (email: string) => {
    // Simulate API call
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser: User = { email, name: email.split('@')[0] || 'User' };
    setUser(mockUser);
    localStorage.setItem('clientpulse-user', JSON.stringify(mockUser));
    setLoading(false);
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clientpulse-user');
    router.push('/login');
  };
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (loading && !isAuthPage) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
