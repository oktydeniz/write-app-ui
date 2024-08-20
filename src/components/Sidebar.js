import React from 'react';
import { NavLink } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const Sidebar = () => {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>WritePulp</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/home" activeClassName="active"><i className="fas fa-home"></i> Home</NavLink>
          <NavLink to="/contents" activeClassName="active"><i className="fas fa-book"></i> Contents</NavLink>
          <NavLink to="/activities" activeClassName="active"><i className="fas fa-calendar-alt"></i> Activities</NavLink>
          <NavLink to="/teams" activeClassName="active"><i className="fas fa-users"></i> Teams</NavLink>
          <NavLink to="/messages" activeClassName="active"><i className="fas fa-envelope"></i> Messages</NavLink>
          <NavLink to="/notifications" activeClassName="active"><i className="fas fa-bell"></i> Notifications</NavLink>
        
          <hr className="sidebar-divider" />
          
          <NavLink to="/account" activeClassName="active"><i className="fas fa-user"></i> Account</NavLink>
          <NavLink to="/settings" activeClassName="active"><i className="fas fa-cog"></i> Settings</NavLink>
          <NavLink to="/help" activeClassName="active"><i className="fas fa-question-circle"></i> Help</NavLink>
          <NavLink to="/logout" activeClassName="active"><i className="fas fa-sign-out-alt"></i> Logout</NavLink>
        </nav>
      </div>
    );
  };

export default Sidebar;
