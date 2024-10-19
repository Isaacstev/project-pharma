// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PharmacySignIn from './pages/PharmacySignIn';
import WholesalerSignIn from './pages/WholesalerSignIn';
import PharmacyDashboard from './dashboards/PharmacyDashboard';
import WholesalerDashboard from './dashboards/WholesalerDashboard';
import Sales from './components/Sales';  // Import Sales page
import Reports from './components/Reports';  // Import Reports page
import Profile from './components/Profile';  // Profile page
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pharmacy-signin" element={<PharmacySignIn />} />
          <Route path="/wholesaler-signin" element={<WholesalerSignIn />} />
          <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
          <Route path="/wholesaler-dashboard" element={<WholesalerDashboard />} />
          <Route path="/sales" element={<Sales />} />  {/* Sales route */}
          <Route path="/reports" element={<Reports />} />  {/* Reports route */}
          <Route path="/profile" element={<Profile />} />  {/* Profile route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
