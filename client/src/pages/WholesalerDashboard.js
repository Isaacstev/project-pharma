import React, { useEffect, useState } from 'react';
import {
  getInventory,
  getLowStock,
  addInventory,
  removeDrug,
} from '../api/inventoryAPI';
import { getOrders, confirmOrder, denyOrder } from '../api/orderAPI';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const WholesalerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newStock, setNewStock] = useState({
    drugName: '',
    description: '',
    batchId: '',
    quantity: '',
    salePrice: '',
    manufactureDate: '',
    expiryDate: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const inventoryData = await getInventory(userId);
        const lowStockData = await getLowStock(userId);
        const orderData = await getOrders(userId, 'Wholesaler');
        setInventory(inventoryData);
        setFilteredInventory(inventoryData);
        setLowStock(lowStockData);
        setOrders(orderData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    setFilteredInventory(
      inventory.filter((item) =>
        item.drug_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleAddStock = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await addInventory(userId, newStock);
      setInventory((prev) => [...prev, response]);
      setShowAddStockModal(false);
      alert('Stock added successfully');
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Failed to add stock');
    }
  };

  const handleRemoveDrug = async (inventoryId) => {
    try {
      const userId = localStorage.getItem('userId');
      await removeDrug(userId, inventoryId);
      setInventory((prev) => prev.filter((item) => item.inventory_id !== inventoryId));
      alert('Drug removed successfully');
    } catch (error) {
      console.error('Error removing drug:', error);
      alert('Failed to remove drug');
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await confirmOrder(orderId);
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId ? { ...order, status: 'Confirmed' } : order
        )
      );
      alert('Order confirmed');
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('Failed to confirm order');
    }
  };

  const handleDenyOrder = async (orderId) => {
    try {
      await denyOrder(orderId);
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId ? { ...order, status: 'Denied' } : order
        )
      );
      alert('Order denied');
    } catch (error) {
      console.error('Error denying order:', error);
      alert('Failed to deny order');
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar type="Wholesaler" />
      <div className="main-content">
        <h1 className="dashboard-header">Wholesaler Dashboard</h1>

        {/* Metrics Section */}
        <div className="dashboard-metrics">
          <div className="dashboard-card">
            <h3>Total Inventory</h3>
            <p>{inventory.length}</p>
          </div>
          <div className="dashboard-card">
            <h3>Low Stock Items</h3>
            <p>{lowStock.length}</p>
          </div>
          <div className="dashboard-card">
            <h3>Pending Orders</h3>
            <p>{orders.filter((order) => order.status === 'Pending').length}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search drug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Inventory Section */}
        <div className="inventory-section">
          <h2>Inventory</h2>
          <button className="add-stock-btn" onClick={() => setShowAddStockModal(true)}>
            Add Stock
          </button>
          <table>
            <thead>
              <tr>
                <th>Drug</th>
                <th>Description</th>
                <th>Batch</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.inventory_id}>
                  <td>{item.drug_name}</td>
                  <td>{item.description}</td>
                  <td>{item.batch_number}</td>
                  <td>{item.quantity}</td>
                  <td>{item.sale_price}</td>
                  <td>
                    <button onClick={() => handleRemoveDrug(item.inventory_id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Orders Section */}
        <div className="orders-section">
          <h2>Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Pharmacy</th>
                <th>Drug</th>
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
                  <td>{order.pharmacy_name}</td>
                  <td>{order.drug_name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.status}</td>
                  <td>{order.payment_method}</td>
                  <td>
                    {order.status === 'Pending' && (
                      <>
                        <button onClick={() => handleConfirmOrder(order.order_id)}>
                          Confirm
                        </button>
                        <button onClick={() => handleDenyOrder(order.order_id)}>
                          Deny
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Stock Modal */}
        {showAddStockModal && (
          <div className="modal">
            <h2>Add Stock</h2>
            <div className="modal-content">
              <input
                type="text"
                name="drugName"
                placeholder="Drug Name"
                value={newStock.drugName}
                onChange={handleInputChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newStock.description}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="batchId"
                placeholder="Batch ID"
                value={newStock.batchId}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newStock.quantity}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="salePrice"
                placeholder="Sale Price"
                value={newStock.salePrice}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="manufactureDate"
                placeholder="Manufacture Date"
                value={newStock.manufactureDate}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="expiryDate"
                placeholder="Expiry Date"
                value={newStock.expiryDate}
                onChange={handleInputChange}
              />
              <button onClick={handleAddStock}>Submit</button>
              <button onClick={() => setShowAddStockModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WholesalerDashboard;
