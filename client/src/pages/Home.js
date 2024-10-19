// src/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';  // Link the updated CSS

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <h1 className="fade-in-up">Welcome to MediPulse</h1>
        <p className="fade-in-up">A comprehensive platform for pharmacies and wholesalers.</p>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature slide-in-left">
          <h2>For Pharmacies</h2>
          <ul>
            <li><span className="material-icons">inventory</span> Manage Inventory Efficiently</li>
            <li><span className="material-icons">point_of_sale</span> Track Sales and Purchases</li>
            <li><span className="material-icons">event</span> Monitor Drug Expiry Dates</li>
            <li><span className="material-icons">bar_chart</span> Generate Sales Reports</li>
            <li><span className="material-icons">autorenew</span> Restock from Suppliers</li>
          </ul>
          <Link to="/pharmacy-signin" className="feature-button">
            Pharmacy Sign In
          </Link>
        </div>

        <div className="feature slide-in-right">
          <h2>For Wholesalers</h2>
          <ul>
            <li><span className="material-icons">warehouse</span> Manage Bulk Inventory</li>
            <li><span className="material-icons">storefront</span> Track Sales to Pharmacies</li>
            <li><span className="material-icons">local_shipping</span> Order Processing and Tracking</li>
            <li><span className="material-icons">analytics</span> Monitor Stock Levels for Pharmacies</li>
            <li><span className="material-icons">insights</span> Sales Analytics and Reporting</li>
          </ul>
          <Link to="/wholesaler-signin" className="feature-button">
            Wholesaler Sign In
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
