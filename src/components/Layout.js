import React from 'react';
import Sidebar from './Sidebar';
import AppBar from './AppBar';
import { Outlet } from 'react-router-dom';

const Layout = ({user}) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <AppBar user={user} />
        <div className="fragment-content">
        <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
