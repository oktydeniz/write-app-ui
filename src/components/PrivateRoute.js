import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('accessToken') != null
    return isAuthenticated ? <Outlet/> : <Navigate to="/login" />;
};

export default PrivateRoute;