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
            <img src="https://placehold.jp/150x150.png" alt="User Avatar" />
          </div>
        </div>
      </div>
    );
  };

export default AppBar;
