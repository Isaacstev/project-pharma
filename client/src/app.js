// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PharmacySignIn from './pages/PharmacySignIn';
import WholesalerSignIn from './pages/WholesalerSignIn';
import './styles/App.css';  // Import global styles

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route should render the Home component */}
          <Route path="/" element={<Home />} />
          <Route path="/pharmacy-signin" element={<PharmacySignIn />} />
          <Route path="/wholesaler-signin" element={<WholesalerSignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
