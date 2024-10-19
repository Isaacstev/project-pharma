// src/components/Modal.js

import React, { useState } from 'react';
import Filter from './Filter';
import '../styles/Modal.css';  // Styles for modal

const Modal = ({ drug, onClose }) => {
  const [viewWholesalers, setViewWholesalers] = useState(false);

  const handleAddClick = () => {
    setViewWholesalers(true);  // Show the list of wholesalers
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{drug.name}</h2>
        <p>Price: ${drug.price}</p>
        <p>Quantity: {drug.quantity}</p>

        <div className="modal-actions">
          <button onClick={handleAddClick}>Add</button>
          <button>Sell</button>
          <button>Remove</button>
        </div>

        {/* Show the list of wholesalers when Add is clicked */}
        {viewWholesalers && (
          <Filter drug={drug} />
        )}

        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
