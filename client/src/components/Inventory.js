// src/components/Inventory.js

import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/Inventory.css';  // Styles for inventory

const Inventory = ({ inventoryItems }) => {
  const [searchTerm, setSearchTerm] = useState('');  // Track the search input
  const [selectedDrug, setSelectedDrug] = useState(null);  // Track the clicked drug

  const handleDrugClick = (drug) => {
    setSelectedDrug(drug);
  };

  const handleCloseModal = () => {
    setSelectedDrug(null);  // Close modal
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);  // Update the search term
  };

  // Filter items based on search input
  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory">
      <h2>Inventory</h2>

      {/* Search Bar */}
      <div className="inventory-search">
        <input
          type="text"
          placeholder="Search by drug name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="material-icons">search</span>
      </div>

      {/* Inventory Table */}
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={index} onClick={() => handleDrugClick(item)}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price}</td>
              <td>
                <button className="inventory-action-button">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for selected drug */}
      {selectedDrug && (
        <Modal drug={selectedDrug} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Inventory;
