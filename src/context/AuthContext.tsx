import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Record<string, string>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (role: 'candidate' | 'recruiter') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted session or default to candidate demo user
    const savedUser = localStorage.getItem('nexus_user');
    const savedToken = localStorage.getItem('nexus_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch {
        setDefaultCandidate();
      }
    } else {
      setDefaultCandidate();
    }
    setLoading(false);
  }, []);

  const setDefaultCandidate = () => {
    const defaultUser: User = {
      id: 1,
      full_name: 'Alex Rivera',
      email: 'alex.candidate@nexus.dev',
      role: 'candidate',
      skills: 'React, TypeScript, Node.js, PostgreSQL, TailwindCSS',
      resume_link: 'https://github.com/alexrivera-portfolio',
      phone: '+1 555-0192',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(defaultUser);
    setToken('nexus-jwt-demo-alex');
    localStorage.setItem('nexus_user', JSON.stringify(defaultUser));
    localStorage.setItem('nexus_token', 'nexus-jwt-demo-alex');
  };

  const login = async (email: string, password: string, role?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to sign in.' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('nexus_user', JSON.stringify(data.user));
      localStorage.setItem('nexus_token', data.token);
      return { success: true };
    } catch {
      return { success: false, error: 'Connection error while contacting auth server.' };
    }
  };

  const register = async (userData: Record<string, string>) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('nexus_user', JSON.stringify(data.user));
      localStorage.setItem('nexus_token', data.token);
      return { success: true };
    } catch {
      return { success: false, error: 'Connection error while contacting auth server.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_token');
  };

  const switchDemoUser = (role: 'candidate' | 'recruiter') => {
    if (role === 'candidate') {
      const candidateUser: User = {
        id: 1,
        full_name: 'Alex Rivera',
        email: 'alex.candidate@nexus.dev',
        role: 'candidate',
        skills: 'React, TypeScript, Node.js, PostgreSQL, TailwindCSS',
        resume_link: 'https://github.com/alexrivera-portfolio',
        phone: '+1 555-0192',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      setUser(candidateUser);
      setToken('nexus-jwt-demo-alex');
      localStorage.setItem('nexus_user', JSON.stringify(candidateUser));
      localStorage.setItem('nexus_token', 'nexus-jwt-demo-alex');
    } else {
      const recruiterUser: User = {
        id: 2,
        full_name: 'Sarah Chen',
        email: 'sarah.recruiter@cyberai.io',
        role: 'recruiter',
        skills: 'Technical Hiring, System Architecture, GenAI Talent',
        company_name: 'CyberAI Labs',
        phone: '+1 555-0348',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      };
      setUser(recruiterUser);
      setToken('nexus-jwt-demo-sarah');
      localStorage.setItem('nexus_user', JSON.stringify(recruiterUser));
      localStorage.setItem('nexus_token', 'nexus-jwt-demo-sarah');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, switchDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
