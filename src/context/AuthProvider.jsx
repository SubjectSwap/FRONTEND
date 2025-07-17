import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${backendUrl}/verify-user`, {
        method: 'POST',
        credentials: 'include',
        accessControlAllowCredentials: true
      });
      if (!res.ok) throw new Error('Not authenticated');
      const data = await res.json();
      if (data && data.email && data.username) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      const resData = await res.json();
      if (res.status !== 200) {
        setError(resData.message || 'Incorrect email or password');
        throw new Error(resData.message || 'Incorrect email or password');
      } else {
        setUser(resData);
        setError('');
      }
    } catch (err) {
      setError('Login failed');
      throw err;
    }
    if (user) navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await fetch(`${backendUrl}/logout`, { method: 'POST', credentials: 'include' });
    } catch {}
    setUser(null);
    navigate('/login');
  };

  const register = async (username, email, password) => {
  setError('');
  setLoading(true);
  try {
    const res = await fetch(`${backendUrl}/create-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
      credentials: 'include',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Account creation failed');
    }
    return data;
  } catch (err) {
    setError(err.message || 'Account creation failed');
    throw err;
  } finally {
    setLoading(false);
  }
};

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    fetchUser,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};