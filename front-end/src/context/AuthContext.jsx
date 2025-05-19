import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };





  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const decodedToken = parseJwt(token);
          console.log("Decoded token:", decodedToken);

          if (decodedToken && decodedToken.user) {
            setCurrentUser({
              id: decodedToken.user.id,
              role: decodedToken.user.role,
              username: decodedToken.user.username,
            });
            console.log("User set from token:", decodedToken.user);
          } else {
            try {
              const response = await axios.get('http://localhost:7000/api/users/login');
              setCurrentUser(response.data);
              console.log("User set from API:", response.data);
            } catch (apiError) {
              console.error('Failed to fetch user data:', apiError);
              localStorage.removeItem('token');
              delete axios.defaults.headers.common['Authorization'];
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/api/auth/register', userData);

      localStorage.setItem('token', response.data.token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      setCurrentUser(response.data.user);

      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:7000/api/users/login', { email, password });

      localStorage.setItem('token', response.data.token);

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      setCurrentUser(response.data.user);

      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');

    delete axios.defaults.headers.common['Authorization'];

    setCurrentUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await axios.put(`/api/users/${currentUser.id}`, userData);

      setCurrentUser(response.data);

      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      await axios.put(`/api/users/${currentUser.id}/password`, {
        currentPassword,
        newPassword
      });

      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to change password');
      throw new Error(error.response?.data?.error || 'Failed to change password');
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
