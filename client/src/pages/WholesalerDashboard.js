import React, { useEffect, useState } from 'react';
import {
  getInventory,
  getLowStock,
  viewAlmostExpired,
  addInventory,
  updateInventory,
  removeDrug,
} from '../api/inventoryAPI';
import { getOrders, confirmOrder, denyOrder } from '../api/orderAPI';
import Sidebar from '../components/Sidebar';
import ModalManager from '../components/ModalManager';
import '../styles/Dashboard.css';

const WholesalerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [almostExpired, setAlmostExpired] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [modalType, setModalType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  // eslint-disable-next-line
  const [thresholds, setThresholds] = useState({ lowStock: 10, expiryDays: 30 }); // Default thresholds

  useEffect(() => {
    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');

            if (!userId || role !== 'Wholesaler') {
                localStorage.clear();
                window.location.href = '/login';
                return;
            }

            // Fetch thresholds from settings API
            const settingsResponse = await fetch(`/api/settings/${userId}`);
            const settingsData = await settingsResponse.json();
            setThresholds(settingsData);

            // Fetch inventory for the Wholesaler role
            const inventoryData = await getInventory(userId, 'Wholesaler'); 
            setInventory(inventoryData);
            setFilteredInventory(inventoryData);

            const lowStockData = await getLowStock(userId, settingsData.lowStock);
            setLowStock(lowStockData);

            const almostExpiredData = await viewAlmostExpired(userId, settingsData.expiryDays);
            setAlmostExpired(almostExpiredData);

            const orderData = await getOrders(userId, role);
            setOrders(orderData);
        } catch (error) {
            console.error('Error fetching data:', error.message);
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

  const openModal = (type, data = {}) => {
    setModalType(type);
    setModalData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData({});
  };

  const handleModalSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (modalType === 'Add Stock') {
        await addInventory(userId, modalData);
      } else if (modalType === 'Edit Stock') {
        await updateInventory(modalData.inventory_id, modalData);
      }
      const updatedInventory = await getInventory(userId, 'Wholesaler');
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
      closeModal();
    } catch (error) {
      console.error(`Error handling ${modalType}:`, error.message);
    }
  };

  const handleEdit = (item) => {
    openModal('Edit Stock', item);
  };

  const handleRemoveDrug = async (inventoryId) => {
    try {
      const userId = localStorage.getItem('userId');
      await removeDrug(userId, inventoryId);
      const updatedInventory = inventory.filter((item) => item.inventory_id !== inventoryId);
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
      alert('Drug removed successfully');
    } catch (error) {
      console.error('Error removing drug:', error.message);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await confirmOrder(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: 'Confirmed' } : order
        )
      );
      alert('Order confirmed');
    } catch (error) {
      console.error('Error confirming order:', error.message);
    }
  };

  const handleDenyOrder = async (orderId) => {
    try {
      await denyOrder(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === orderId ? { ...order, status: 'Denied' } : order
        )
      );
      alert('Order denied');
    } catch (error) {
      console.error('Error denying order:', error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar type="Wholesaler" />
      <div className="main-content">

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
            <h3>Almost Expired Drugs</h3>
            <p>{almostExpired.length}</p>
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
          <button className="add-stock-btn" onClick={() => openModal('Add Stock')}>
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
                  <td>
                    {item.drug_name}{' '}
                    {lowStock.some((low) => low.inventory_id === item.inventory_id) && (
                      <span role="img" aria-label="Low stock warning">
                        ⚠️
                      </span>
                    )}
                    {almostExpired.some((expired) => expired.inventory_id === item.inventory_id) && (
                      <span role="img" aria-label="Almost expired">
                        ⏳
                      </span>
                    )}
                  </td>
                  <td>{item.description}</td>
                  <td>{item.batch_number}</td>
                  <td>{item.quantity}</td>
                  <td>{item.sale_price}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
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
                        <button onClick={() => handleConfirmOrder(order.order_id)}>Confirm</button>
                        <button onClick={() => handleDenyOrder(order.order_id)}>Deny</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Manager */}
        <ModalManager
          type={modalType}
          showModal={showModal}
          closeModal={closeModal}
          modalData={modalData}
          handleInputChange={(e) =>
            setModalData({ ...modalData, [e.target.name]: e.target.value })
          }
          handleSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
};

export default WholesalerDashboard;
