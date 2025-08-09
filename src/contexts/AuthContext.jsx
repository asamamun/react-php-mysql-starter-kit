import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const AuthContext = createContext({
  authData: {
    status: null,
    message: null,
    user: null,
  },
  login: () => { },
  logout: () => { },
  isAdmin: () => false,
  isUser: () => false,
});

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const storedAuthData = localStorage.getItem('authData');
    if (storedAuthData) {
      try {
        return JSON.parse(storedAuthData);
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('authData');
      }
    }
    return {
      status: null,
      message: null,
      user: null,
    };
  });

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}auth/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setAuthData(data);

      if (data && data.user) {
        localStorage.setItem('authData', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        localStorage.removeItem('authData');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    setAuthData({
      status: null,
      message: null,
      user: null,
    });
    localStorage.removeItem('authData');
    navigate('/login');
  };

  const isAdmin = () => {
    return authData?.user?.role === '1';
  };

  const isUser = () => {
    return authData?.user?.role === '3';
  };

  useEffect(() => {
    if (authData && authData.user) {
      localStorage.setItem('authData', JSON.stringify(authData));
    } else {
      localStorage.removeItem('authData');
    }
  }, [authData]);

  return (
    <AuthContext.Provider value={{
      authData,
      setAuthData,
      login,
      logout,
      isAdmin,
      isUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };