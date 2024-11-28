import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';

const Settings = ({ userId }) => {
    const [thresholds, setThresholds] = useState({
        lowStock: 10,
        expiryDays: 30,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`/api/settings/${userId}`);
                const data = await response.json();
                setThresholds(data);
            } catch (error) {
                console.error('Error fetching settings:', error.message);
            }
        };

        fetchSettings();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setThresholds((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    };

    const handleSaveSettings = async () => {
        try {
            await fetch(`/api/settings/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(thresholds),
            });
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Error saving settings:', error.message);
            alert('Failed to update settings.');
        }
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-form">
                <div>
                    <label>Low Stock Threshold</label>
                    <input
                        type="number"
                        name="lowStock"
                        value={thresholds.lowStock}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Expiry Threshold (in days)</label>
                    <input
                        type="number"
                        name="expiryDays"
                        value={thresholds.expiryDays}
                        onChange={handleInputChange}
                    />
                </div>
                <button onClick={handleSaveSettings}>Save Settings</button>
            </div>
        </div>
    );
};

export default Settings;
