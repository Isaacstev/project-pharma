import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AuthForm from './components/AuthForm';
import PharmacyDashboard from './pages/PharmacyDashboard';
import WholesalerDashboard from './pages/WholesalerDashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Orders from './pages/Orders';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthForm />} />
                <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
                <Route path="/wholesaler-dashboard" element={<WholesalerDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/Orders" element={<Orders />} />
            </Routes>
        </Router>
    );
};

export default App;
