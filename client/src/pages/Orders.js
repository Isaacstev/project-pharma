import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar'; // Import the Sidebar
import { getSalesReport } from '../api/orderAPI'; // Import the API function
import '../styles/Orders.css';

const SalesReport = () => {
    const [salesReport, setSalesReport] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedRole = localStorage.getItem('role');

        if (!storedUserId || !storedRole) {
            console.error('User ID or role is missing. Redirecting to login.');
            localStorage.clear();
            window.location.href = '/login';
            return;
        }

        setUserId(storedUserId);
        setRole(storedRole);
    }, []);

    const handleGenerateReport = async () => {
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const reportData = await getSalesReport(userId, role, startDate, endDate);

            if (reportData.length === 0) {
                setError('No sales data found for the selected dates.');
            } else {
                setSalesReport(reportData);
            }
        } catch (error) {
            console.error('Error generating report:', error.message);
            setError('Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar /> {/* Sidebar included */}
            <div className="main-content">
                <h1>Sales Report</h1>
                <div className="sales-report-section">
                    <h2>Generate Sales Report</h2>
                    <div className="date-inputs">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Start Date"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                        />
                        <button onClick={handleGenerateReport} disabled={loading}>
                            {loading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {salesReport.length > 0 && (
                        <table className="sales-report-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Drug Name</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total Cost</th>
                                    <th>Order Date</th>
                                    <th>Payment Method</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesReport.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.order_id || 'N/A'}</td>
                                        <td>{item.drug_name || 'N/A'}</td>
                                        <td>{item.quantity || 0}</td>
                                        <td>
                                            {item.unit_price !== null && !isNaN(item.unit_price)
                                                ? `$${parseFloat(item.unit_price).toFixed(2)}`
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            {item.subtotal !== null && !isNaN(item.subtotal)
                                                ? `$${parseFloat(item.subtotal).toFixed(2)}`
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            {item.order_date
                                                ? new Date(item.order_date).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td>{item.payment_method || 'N/A'}</td>
                                        <td>{item.status || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesReport;
