// src/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';  // Make sure the correct path is used for the styles

const Home = () => {
  return (
    <div className="home">
      <h1>MediPulse</h1>
      <p>Please select your role to proceed:</p>
      <div className="role-selection">
        <Link to="/pharmacy-signin" className="role-button">
          Pharmacy
        </Link>
        <Link to="/wholesaler-signin" className="role-button">
          Wholesaler
        </Link>
      </div>
    </div>
  );
};

export default Home;
