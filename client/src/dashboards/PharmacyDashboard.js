// src/dashboards/PharmacyDashboard.js

import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Inventory from '../components/Inventory';
import DashboardCard from '../components/DashboardCard';
import '../styles/Dashboard.css';

const PharmacyDashboard = () => {
  // Sample inventory items for Pharmacy
  const pharmacyItems = [
    { name: 'Paracetamol', quantity: 100, price: 5 },
    { name: 'Amoxicillin', quantity: 80, price: 10 },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        
        {/* Dashboard Metrics Section */}
        <div className="dashboard-metrics">
          <DashboardCard title="Total Inventory" value="180" icon="inventory_2" />
          <DashboardCard title="Out of Stock" value="5" icon="error_outline" />
          <DashboardCard title="Pending Orders" value="12" icon="shopping_cart" />
        </div>

        {/* Inventory Table */}
        <Inventory inventoryItems={pharmacyItems} />
      </div>
    </div>
  );
};

export default PharmacyDashboard;
