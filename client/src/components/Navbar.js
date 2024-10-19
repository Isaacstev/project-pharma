// src/components/Navbar.js

import React from 'react';
import '../styles/Dashboard.css'; 

const Navbar = () => {
  return (
    <div className="navbar">
      <h1>MediPulse Dashboard</h1>
      <div className="user-info">
        <span>Welcome, User!</span>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
