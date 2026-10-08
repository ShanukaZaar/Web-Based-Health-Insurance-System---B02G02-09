import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('auth_token') || null;
  });

  const [role, setRole] = useState(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.role || (parsed.roles?.includes('ROLE_ADMIN') || parsed.roles?.includes('ADMIN') ? 'ADMIN' : 'USER');
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const normalizeRole = (u) => {
    if (!u) return 'USER';
    if (u.role === 'ADMIN' || u.role === 'ROLE_ADMIN') return 'ADMIN';
    if (u.roles && (u.roles.includes('ADMIN') || u.roles.includes('ROLE_ADMIN'))) return 'ADMIN';
    return 'USER';
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await authService.login({ username, password });
      const authData = res?.data || res;
      const authToken = authData?.token;
      const authUser = authData?.user;

      if (!authToken || !authUser) {
        throw new Error(res?.message || 'Login failed. Invalid response from server.');
      }

      const userRole = normalizeRole(authUser);
      const enrichedUser = { ...authUser, role: userRole };

      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(enrichedUser));

      setToken(authToken);
      setUser(enrichedUser);
      setRole(userRole);

      return { success: true, role: userRole, user: enrichedUser };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed. Please check credentials.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await authService.register(userData);
      const authData = res?.data || res;
      const authToken = authData?.token;
      const authUser = authData?.user;

      if (!authToken || !authUser) {
        throw new Error(res?.message || 'Registration failed. Invalid response from server.');
      }

      const userRole = normalizeRole(authUser);
      const enrichedUser = { ...authUser, role: userRole };

      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(enrichedUser));

      setToken(authToken);
      setUser(enrichedUser);
      setRole(userRole);

      return { success: true, role: userRole, user: enrichedUser };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please check your details.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setRole(null);
  };

  const isAdmin = role === 'ADMIN';
  const isUser = role === 'USER';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isAdmin,
        isUser,
        loading,
        login,
        register,
        logout,
      }}
    >
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

export default AuthContext;
