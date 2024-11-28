import React, { useEffect, useState } from 'react';
import { getInventory, getLowStock, addInventory, searchDrug } from '../api/inventoryAPI';
import { placeOrder, getWholesalers } from '../api/orderAPI';
import Sidebar from '../components/Sidebar';
import '../styles/Dashboard.css';

const PharmacyDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [wholesalers, setWholesalers] = useState([]);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false);
  const [newStock, setNewStock] = useState({
    drugName: '',
    description: '',
    batchId: '',
    quantity: '',
    salePrice: '',
    manufactureDate: '',
    expiryDate: '',
  });
  const [orderDetails, setOrderDetails] = useState({
    drugName: '',
    quantity: '',
    wholesalerId: '',
    paymentMethod: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const inventoryData = await getInventory(userId);
        const lowStockData = await getLowStock(userId);
        setInventory(inventoryData);
        setFilteredInventory(inventoryData);
        setLowStock(lowStockData);

        const wholesalersData = await getWholesalers(); // Fetch all wholesalers
        setWholesalers(wholesalersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStock({ ...newStock, [name]: value });
  };

  const handleSearch = async () => {
    try {
      const result = await searchDrug(searchTerm);
      setFilteredInventory(result);
    } catch (error) {
      console.error('Error searching drug:', error);
    }
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

  const handlePlaceOrder = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Pharmacy ID
      console.log('Placing order with:', {
        pharmacyId: parseInt(userId, 10),
        wholesalerId: parseInt(orderDetails.wholesalerId, 10),
        drugName: orderDetails.drugName,
        quantity: parseInt(orderDetails.quantity, 10),
        paymentMethod: orderDetails.paymentMethod,
      });
  
      await placeOrder({
        pharmacyId: parseInt(userId, 10),
        wholesalerId: parseInt(orderDetails.wholesalerId, 10),
        drugName: orderDetails.drugName,
        quantity: parseInt(orderDetails.quantity, 10),
        paymentMethod: orderDetails.paymentMethod,
      });
  
      setShowPlaceOrderModal(false);
      alert('Order placed successfully');
    } catch (error) {
      console.error('Error placing order:', error.message);
      alert(error.message || 'Failed to place order');
    }
  };
  
  return (
    <div className="dashboard-container">
      <Sidebar type="Pharmacy" />
      <div className="main-content">
        <h1 className="dashboard-header">Pharmacy Dashboard</h1>

        <div className="dashboard-metrics">
          <div className="dashboard-card">
            <h3>Total Inventory</h3>
            <p>{inventory.length}</p>
          </div>
          <div className="dashboard-card">
            <h3>Low Stock Items</h3>
            <p>{lowStock.length}</p>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search drug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="inventory-section">
          <h2>Inventory</h2>
          <button className="add-stock-btn" onClick={() => setShowAddStockModal(true)}>
            Add Stock
          </button>
          <button
            className="add-stock-btn"
            onClick={() => {
              setShowPlaceOrderModal(true);
            }}
          >
            Place Order
          </button>
          <table>
            <thead>
              <tr>
                <th>Drug</th>
                <th>Description</th>
                <th>Batch</th>
                <th>Quantity</th>
                <th>Price</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

        {showPlaceOrderModal && (
          <div className="modal">
            <h2>Place Order</h2>
            <div className="modal-content">
              <input
                type="text"
                name="drugName"
                placeholder="Drug Name"
                value={orderDetails.drugName}
                onChange={(e) => setOrderDetails({ ...orderDetails, drugName: e.target.value })}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={orderDetails.quantity}
                onChange={(e) => setOrderDetails({ ...orderDetails, quantity: e.target.value })}
              />
              <select
                name="wholesalerId"
                value={orderDetails.wholesalerId}
                onChange={(e) => setOrderDetails({ ...orderDetails, wholesalerId: e.target.value })}
              >
                <option value="">Select Wholesaler</option>
                {wholesalers.map((wholesaler) => (
                  <option key={wholesaler.user_id} value={wholesaler.user_id}>
                    {wholesaler.name}
                  </option>
                ))}
              </select>
              <select
                name="paymentMethod"
                value={orderDetails.paymentMethod}
                onChange={(e) => setOrderDetails({ ...orderDetails, paymentMethod: e.target.value })}
              >
                <option value="">Select Payment Method</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Credit Card">Credit Card</option>
              </select>
              <button onClick={handlePlaceOrder}>Submit</button>
              <button onClick={() => setShowPlaceOrderModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyDashboard;
