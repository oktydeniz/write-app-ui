import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from 'auth/Login.js';
import PrivateRoute from 'components/PrivateRoute.js';
import Home from 'home/Home.js';
import NotFound from 'screen/NotFound.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/login" element={<ProtectedRoute element={<Login />} />} />
          <Route path="/register" element={<ProtectedRoute element={<Login />} />} />
          <Route path="/forgot" element={<ProtectedRoute element={<Login />} />} />
          <Route path="/regenerate" element={<ProtectedRoute element={<Login />} />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>
      </Routes>
    </Router>
  );
}

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('accessToken') != null;
  return isAuthenticated ? <Navigate to="/" /> : element;
};

export default App;