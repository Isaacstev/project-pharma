// src/components/Sales.js

import React from 'react';
import '../styles/Sales.css';  // Sales page styles

const Sales = () => {
  // Mock data for sales
  const salesData = [
    { product: 'Paracetamol', date: '2024-10-15', quantity: 100, total: 500 },
    { product: 'Aspirin', date: '2024-10-16', quantity: 80, total: 400 },
    { product: 'Ibuprofen', date: '2024-10-17', quantity: 150, total: 900 },
  ];

  return (
    <div className="sales-page">
      <h2>Sales Overview</h2>
      <table className="sales-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Date</th>
            <th>Quantity</th>
            <th>Total Sales ($)</th>
          </tr>
        </thead>
        <tbody>
          {salesData.map((sale, index) => (
            <tr key={index}>
              <td>{sale.product}</td>
              <td>{sale.date}</td>
              <td>{sale.quantity}</td>
              <td>{sale.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Sales;
