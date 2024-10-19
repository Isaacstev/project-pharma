// src/components/Reports.js

import React from 'react';
import Charts from './Charts';
import '../styles/Reports.css';  // Reports page styles

const Reports = () => {
  return (
    <div className="reports-page">
      <h2>Sales Reports</h2>
      <div className="charts-container">
        {/* Charts for sales over time, best-selling products, etc. */}
        <Charts title="Total Sales Over Time" type="line" />
        <Charts title="Best-Selling Products" type="bar" />
      </div>
    </div>
  );
};

export default Reports;
