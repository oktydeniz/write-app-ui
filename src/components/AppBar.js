import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import 'assets/style/root.scss';

const AppBar = () => {
    
    return (
      <div className="app-bar">
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="app-bar-icons">
          <div className="icon-wrapper">
            <i className="fas fa-bell"></i>
            <span className="badge">3</span>
          </div>
          <div className="icon-wrapper">
            <i className="fas fa-envelope"></i>
            <span className="badge">5</span>
          </div>
          <div className="avatar">
            <img src="https://via.placeholder.com/40" alt="User Avatar" />
        
              <div className="dropdown-menu">
                <div className="dropdown-header">Team</div>
                <NavLink to="/team-a" className="dropdown-item">Team A</NavLink>
                <NavLink to="/team-b" className="dropdown-item">Team B</NavLink>
                <hr className="dropdown-divider" />
                <NavLink to="/account" className="dropdown-item">Account</NavLink>
                <NavLink to="/settings" className="dropdown-item">Settings</NavLink>
                <NavLink to="/logout" className="dropdown-item">Logout</NavLink>
              </div>
            
          </div>
        </div>
      </div>
    );
  };

export default AppBar;
