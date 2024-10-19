// src/components/Filter.js

import React, { useState } from 'react';
import '../styles/Filter.css';  // Styles for filter

const Filter = ({ drug }) => {
  const [filter, setFilter] = useState({ price: '', availability: '', distance: '' });

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const wholesalers = [
    { name: 'Wholesaler A', price: 20, availability: 50, distance: '10km' },
    { name: 'Wholesaler B', price: 22, availability: 40, distance: '15km' },
    { name: 'Wholesaler C', price: 18, availability: 60, distance: '5km' }
  ];

  // Apply filters
  const filteredWholesalers = wholesalers.filter(wholesaler =>
    (!filter.price || wholesaler.price <= filter.price) &&
    (!filter.availability || wholesaler.availability >= filter.availability) &&
    (!filter.distance || parseInt(wholesaler.distance) <= parseInt(filter.distance))
  );

  return (
    <div className="filter-section">
      <h3>Available Wholesalers for {drug.name}</h3>

      <div className="filter-options">
        <label>
          Max Price:
          <input type="number" name="price" value={filter.price} onChange={handleFilterChange} />
        </label>
        <label>
          Min Availability:
          <input type="number" name="availability" value={filter.availability} onChange={handleFilterChange} />
        </label>
        <label>
          Max Distance (km):
          <input type="number" name="distance" value={filter.distance} onChange={handleFilterChange} />
        </label>
      </div>

      <ul className="wholesaler-list">
        {filteredWholesalers.map((wholesaler, index) => (
          <li key={index}>
            <p>Name: {wholesaler.name}</p>
            <p>Price: ${wholesaler.price}</p>
            <p>Availability: {wholesaler.availability} units</p>
            <p>Distance: {wholesaler.distance}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Filter;
