import React, { useState } from 'react';
import '../styles/Orders.css';

const SalesReport = ({ userId, role }) => {
    const [salesReport, setSalesReport] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleGenerateReport = async () => {
        try {
          const response = await fetch(
            `/api/sales-report?userId=${userId}&role=${role}&startDate=${startDate}&endDate=${endDate}`
          );
          const reportData = await response.json();
          setSalesReport(reportData);
        } catch (error) {
          console.error('Error generating report:', error.message);
        }
      };

    return (
        <div className="orders-container">
            <h1>Sales Report</h1>
            <div className="sales-report-section">
                <h2>Generate Sales Report</h2>
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
                <button onClick={handleGenerateReport}>Generate</button>
                {salesReport.length > 0 && (
                    <table className="sales-report-table">
                        <thead>
                            <tr>
                                <th>Drug Name</th>
                                <th>Total Quantity</th>
                                <th>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesReport.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.drug_name}</td>
                                    <td>{item.total_quantity}</td>
                                    <td>{item.total_sales}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SalesReport;
