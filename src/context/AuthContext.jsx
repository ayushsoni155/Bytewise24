// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from '../services/axios';
import Notification from '../components/Notification';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notify, setNotify] = useState({
    open: false,
    message: '',
    type: 'success',
  });

  const showNotification = (msg, type = 'success') => {
    setNotify({ open: true, message: msg, type });
  };

  // Fetch user if token exists
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get('/auth/me');
      setUser(res.data.user || res.data);
    } catch (err) {
      console.error('Auth load error:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Login
  const login = async (credentials) => {
    try {
      const res = await axios.post('/auth/login', credentials);
      localStorage.setItem('token', res.data.token || res.data.Token);
      await fetchUser();
      showNotification('Login successful!', 'success');
    } catch (error) {
      showNotification('Login failed!', 'error');
      throw error;
    }
  };

  // Signup
  const signup = async (data) => {
    try {
      const res = await axios.post('/auth/signup', data);
      localStorage.setItem('token', res.data.token || res.data.Token);
      await fetchUser();
      showNotification('Signup successful!', 'success');
    } catch (error) {
      showNotification('Signup failed!', 'error');
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.get('/auth/logout');
    } catch (error) {
      showNotification('Logout failed!', 'error');
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      showNotification('Logout successful!', 'success');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        fetchUser,
        logout,
        loading,
        isLoggedIn: !!user,
      }}
    >
      {children}
      <Notification
        open={notify.open}
        message={notify.message}
        type={notify.type}
        onClose={() => setNotify({ ...notify, open: false })}
      />
    </AuthContext.Provider>
  );
};
