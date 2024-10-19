// src/components/DashboardCard.js

import React from 'react';
import '../styles/Card.css';  

const DashboardCard = ({ title, value, icon }) => {
  return (
    <div className="dashboard-card">
      <div className="card-content">
        <div className="card-icon">
          <span className="material-icons">{icon}</span>
        </div>
        <div className="card-details">
          <h4>{title}</h4>
          <h2>{value}</h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
