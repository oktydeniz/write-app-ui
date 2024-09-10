import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "assets/style/main.scss";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setOpen(true); 
  };

  const handleCancel = () => {
    setOpen(false); 
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <NavLink
          style={{ textDecoration: "none" }}
          to="/home"
          activeClassName="active"
        >
          <h2 className="app-name">WritePulp</h2>
        </NavLink>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/home" activeClassName="active">
          <i className="fas fa-home home-icon"></i> Home
        </NavLink>
        <NavLink to="/contents" activeClassName="active">
          <i className="fas fa-book home-icon"></i> Contents
        </NavLink>
        <NavLink to="/messages" activeClassName="active">
          <i className="fas fa-envelope home-icon"></i> Messages
        </NavLink>
        <NavLink to="/notifications" activeClassName="active">
          <i className="fas fa-bell home-icon"></i> Notifications
        </NavLink>
        <NavLink to="/account" activeClassName="active">
          <i className="fas fa-user home-icon"></i> Account
        </NavLink>
        {/* 

        <NavLink to="/activities" activeClassName="active">
          <i className="fas fa-calendar-alt"></i> Activities
        </NavLink>
          <hr className="sidebar-divider" />
          <NavLink to="/settings" activeClassName="active">
          <i className="fas fa-cog"></i> Settings
        </NavLink>
        <NavLink to="/help" activeClassName="active">
          <i className="fas fa-question-circle"></i> Help
        </NavLink>
          */}
        <NavLink className="logout-btn"  style={{ backgroundColor: 'transparent'}} to="#" onClick={handleLogoutClick}>
          <i className="fas fa-sign-out-alt home-icon"></i> Logout
        </NavLink>
        {/* Logout Confirmation Dialog */}
        <Dialog open={open} onClose={handleCancel}>
          <DialogTitle>Logout Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to log out?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleLogout} color="secondary">
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </nav>
    </div>
  );
};

export default Sidebar;
