import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; // Import the Sidebar
import '../styles/Settings.css';

const Settings = ({ setLowStockThreshold, setExpiryDaysThreshold }) => {
    const [localThresholds, setLocalThresholds] = useState({
        lowStock: 10,
        expiryDays: 30,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalThresholds((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    };

    const handleSaveSettings = () => {
        setLowStockThreshold(localThresholds.lowStock);
        setExpiryDaysThreshold(localThresholds.expiryDays);
        alert('Thresholds updated successfully!');
    };

    return (
        <div className="dashboard-container">
            <Sidebar /> {/* Sidebar included */}
            <div className="main-content">
                <h1>Settings</h1>
                <div className="settings-form">
                    <div>
                        <label>Low Stock Threshold</label>
                        <input
                            type="number"
                            name="lowStock"
                            value={localThresholds.lowStock}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Expiry Threshold (in days)</label>
                        <input
                            type="number"
                            name="expiryDays"
                            value={localThresholds.expiryDays}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button onClick={handleSaveSettings}>Save Settings</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
