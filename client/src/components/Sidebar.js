// src/components/Sidebar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';  // Sidebar styles

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link to="/pharmacy-dashboard" className={location.pathname === "/pharmacy-dashboard" ? "active" : ""}>
              <span className="material-icons">inventory_2</span> Pharmacy Inventory
            </Link>
          </li>
          <li>
            <Link to="/wholesaler-dashboard" className={location.pathname === "/wholesaler-dashboard" ? "active" : ""}>
              <span className="material-icons">inventory_2</span> Wholesaler Inventory
            </Link>
          </li>
          <li>
            <Link to="/sales" className={location.pathname === "/sales" ? "active" : ""}>
              <span className="material-icons">attach_money</span> Sales
            </Link>
          </li>
          <li>
            <Link to="/reports" className={location.pathname === "/reports" ? "active" : ""}>
              <span className="material-icons">assessment</span> Reports
            </Link>
          </li>
          <li>
            <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
              <span className="material-icons">person</span> Profile
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings" className={location.pathname === "/dashboard/settings" ? "active" : ""}>
              <span className="material-icons">settings</span> Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
