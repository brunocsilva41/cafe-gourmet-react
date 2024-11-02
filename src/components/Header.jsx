// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import '../assets/styles/header.css';
import { useAuth } from '../context/AuthContext';
import { useAuthLogout } from '../utils/auth';

const Header = () => {
  const { user } = useAuth();
  const handleLogout = useAuthLogout();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (user) {
      setUserName(user.userName);
    }
  }, [user]);

  return (
    <header className="header">
      <div className="user-info">
        <span>{userName}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;