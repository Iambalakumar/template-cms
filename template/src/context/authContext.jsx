import React, { createContext, useContext, useState, useEffect } from 'react';
import { isTokenExpired } from '../utils/authUtils';

const AuthContext = createContext();

// Function to decode JWT token and extract user information
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const [, payloadBase64] = token.split('.');
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      // Decode token to get user information
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        setUser({
          userId: decodedToken.userId,
          username: decodedToken.email, // Using email as username for now
          email: decodedToken.email,
          role: decodedToken.role
        });
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
