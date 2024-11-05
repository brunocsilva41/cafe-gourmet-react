// src/context/AuthContext.js
import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUserName } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    const userName = getUserName();
    const role = localStorage.getItem('role');
    if (token && userName && role) {
      setUser({ token, userName, role });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
