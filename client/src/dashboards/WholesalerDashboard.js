// src/dashboards/WholesalerDashboard.js

import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Inventory from '../components/Inventory';
import DashboardCard from '../components/DashboardCard';
import '../styles/Dashboard.css';

const WholesalerDashboard = () => {
  // Sample inventory items for Wholesaler
  const wholesalerItems = [
    { name: 'Aspirin', quantity: 500, price: 2 },
    { name: 'Ibuprofen', quantity: 300, price: 7 },
    { name: 'Cough Syrup', quantity: 150, price: 15 },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />

        {/* Dashboard Metrics Section */}
        <div className="dashboard-metrics">
          <DashboardCard title="Total Inventory" value="950" icon="inventory_2" />
          <DashboardCard title="Out of Stock" value="3" icon="error_outline" />
          <DashboardCard title="Pending Orders" value="8" icon="shopping_cart" />
        </div>

        {/* Inventory Table */}
        <Inventory inventoryItems={wholesalerItems} />
      </div>
    </div>
  );
};

export default WholesalerDashboard;
