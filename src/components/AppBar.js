import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import "assets/style/root.scss";
import { Avatar } from "@mui/material";

const AppBar = ({ user }) => {

  const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleMessageClick = () => {
    navigate('/messages');
  };
  return (
    <div className="app-bar">
      <div className="search-bar">
       
      </div>
      <div className="app-bar-icons">
        <div className="icon-wrapper" onClick={handleNotificationClick}>
          <i className="fas fa-bell"></i>
          <span className="badge">{user ? user.notification : 0}</span>
        </div>
        <div className="icon-wrapper" onClick={handleMessageClick}>
          <i className="fas fa-envelope"></i>
          <span className="badge">{user ? user.message : 0}</span>
        </div>
        {
          user &&
          <div style={{marginLeft:'1rem'}}>
          <Avatar className="avatar" alt={user.user.userName} src={user.user.avatarUrl} />
          </div>
        }
      </div>
    </div>
  );
};

export default AppBar;
