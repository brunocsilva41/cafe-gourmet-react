// src/context/AuthContext.js
import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, getuserEmail, getuserId, getUserName } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = getuserId();
    const token = getToken();
    const userName = getUserName();
    const userEmail = getuserEmail();
    const role = localStorage.getItem('role');
    if (token && userId && userName && userEmail && role) {
      setUser({ token, userId, userName,userEmail, role });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    console.log('Estado do Usuario Atualizado:', userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
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
