import React, { useEffect, useState } from 'react';
import { getOrders, confirmOrder, denyOrder } from '../api/orderAPI';
import '../styles/Orders.css';

const Orders = ({ userId, role }) => {
    const [orders, setOrders] = useState([]);
    const [salesReport, setSalesReport] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const result = await getOrders(userId, role);
                setOrders(result);
            } catch (error) {
                console.error('Error fetching orders:', error.message);
            }
        };

        fetchOrders();
    }, [userId, role]);

    const handleGenerateReport = async () => {
        try {
            const response = await fetch(`/api/sales-report?userId=${userId}&startDate=${startDate}&endDate=${endDate}`);
            const reportData = await response.json();
            setSalesReport(reportData);
        } catch (error) {
            console.error('Error generating report:', error.message);
        }
    };

    return (
        <div className="orders-container">
            <h1>Orders</h1>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Drug Name</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Payment Method</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id}>
                            <td>{order.order_id}</td>
                            <td>{order.drug_name}</td>
                            <td>{order.quantity}</td>
                            <td>{order.status}</td>
                            <td>{order.payment_method}</td>
                            <td>
                                {role === 'Wholesaler' && order.status === 'Pending' && (
                                    <>
                                        <button onClick={() => confirmOrder(order.order_id)}>Confirm</button>
                                        <button onClick={() => denyOrder(order.order_id)}>Deny</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

export default Orders;
