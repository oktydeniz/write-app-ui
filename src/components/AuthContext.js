import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    accessToken: null,
    refreshToken: null,
    role: null,
    userName: null,
    userId: null,
    email: null,
  });

  const saveUser = (data) => {
    setAuthData({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        role: data.role,
        userName: data.userName,
        userId: data.userId,
        email: data.email,
    });

  };
useEffect(() => {
    localStorage.setItem('authData', JSON.stringify(authData));
  }, [authData]);

  const logout = () => {
    setAuthData({
        accessToken: null,
        refreshToken: null,
        role: null,
        userName: null,
        userId: null,
        email: null,
    });
    localStorage.removeItem('authData');
  };

  const isAuthenticated = () => {
    return authData.accessToken != null || localStorage.getItem('authData') != null;
  };

  return (
    <AuthContext.Provider value={{ authData, saveUser, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

//export const useAuth = () => useContext(AuthContext);
