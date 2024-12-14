import React, { useEffect, useState } from 'react';
import {
  getInventory,
  getLowStock,
  viewAlmostExpired,
  addInventory,
  updateInventory,
  removeDrug,
  getWholesalersForDrug,
} from '../api/inventoryAPI';
import { placeOrder, getWholesalers } from '../api/orderAPI';
import Sidebar from '../components/Sidebar';
import ModalManager from '../components/ModalManager';
import '../styles/Dashboard.css';

const PharmacyDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [almostExpired, setAlmostExpired] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [wholesalers, setWholesalers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [options, setOptions] = useState([]);
  // eslint-disable-next-line
  const [thresholds, setThresholds] = useState({ lowStock: 10, expiryDays: 30 });

  useEffect(() => {
    const fetchData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const role = localStorage.getItem('role');

            if (!userId || role !== 'Pharmacy') {
                localStorage.clear();
                window.location.href = '/login';
                return;
            }

            // Fetch thresholds from settings API
            const settingsResponse = await fetch(`/api/settings/${userId}`);
            const settingsData = await settingsResponse.json();
            setThresholds(settingsData);

            // Fetch inventory for the Pharmacy role
            const inventoryData = await getInventory(userId, 'Pharmacy'); //
            setInventory(inventoryData);
            setFilteredInventory(inventoryData);

            const lowStockData = await getLowStock(userId, settingsData.lowStock);
            setLowStock(lowStockData);

            const almostExpiredData = await viewAlmostExpired(userId, settingsData.expiryDays);
            setAlmostExpired(almostExpiredData);

            const wholesalersData = await getWholesalers();
            setWholesalers(wholesalersData);
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

    if (type === 'Restock') {
      getWholesalersForDrug(data.drugId).then((wholesalerOptions) => {
        setOptions(wholesalerOptions);
      });
    } else if (type === 'Place Order') {
      setOptions(wholesalers);
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData({});
  };

  const handleRestock = async (drugId) => {
    if (!drugId) {
      alert('Unable to restock. Drug ID is missing.');
      return;
    }

    try {
      const wholesalersData = await getWholesalersForDrug(drugId);

      setModalData((prev) => ({
        ...prev,
        drugId,
        quantity: '',
        wholesalerId: '',
        paymentMethod: '',
      }));

      setWholesalers(wholesalersData);

      openModal('Restock');
    } catch (error) {
      console.error('Error fetching wholesalers for restocking:', error.message);
      alert('Failed to fetch wholesalers. Please try again.');
    }
  };

  const handleModalSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');

      if (modalType === 'Add Stock') {
        await addInventory(userId, modalData);
      } else if (modalType === 'Edit Stock') {
        await updateInventory(modalData.inventory_id, modalData);
      } else if (modalType === 'Restock') {
        if (!modalData.wholesalerId || !modalData.quantity || !modalData.paymentMethod) {
          alert('Please fill all required fields for restocking.');
          return;
        }

        await placeOrder({
          pharmacyId: userId,
          wholesalerId: modalData.wholesalerId,
          drugName: modalData.drugId,
          quantity: parseInt(modalData.quantity, 10),
          paymentMethod: modalData.paymentMethod,
        });

        alert('Restock order placed successfully.');
      } else if (modalType === 'Place Order') {
        if (!modalData.wholesalerId || !modalData.drugName || !modalData.quantity || !modalData.paymentMethod) {
          alert('Please fill all required fields for placing an order.');
          return;
        }

        await placeOrder({
          pharmacyId: userId,
          wholesalerId: modalData.wholesalerId,
          drugName: modalData.drugName,
          quantity: parseInt(modalData.quantity, 10),
          paymentMethod: modalData.paymentMethod,
        });

        alert('Order placed successfully.');
      }

      const updatedInventory = await getInventory(userId, 'Pharmacy');
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);

      closeModal();
    } catch (error) {
      console.error(`Error handling ${modalType} modal:`, error.message);
      alert(`Failed to ${modalType.toLowerCase()}. Please try again.`);
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

  return (
    <div className="dashboard-container">
      <Sidebar type="Pharmacy" />
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
          <button className="add-stock-btn" onClick={() => openModal('Place Order')}>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.inventory_id}>
                  <td>
                    {item.drug_name}
                    {lowStock.some((lowItem) => lowItem.inventory_id === item.inventory_id) && (
                        // eslint-disable-next-line
                      <span className="icon-warning" title="Low Stock">⚠️</span>
                    )}
                    {almostExpired.some((expItem) => expItem.inventory_id === item.inventory_id) && (
                        // eslint-disable-next-line
                      <span className="icon-expired" title="Almost Expired">⏳</span>
                    )}
                  </td>
                  <td>{item.description}</td>
                  <td>{item.batch_number}</td>
                  <td>{item.quantity}</td>
                  <td>{item.sale_price}</td>
                  <td>
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleRemoveDrug(item.inventory_id)}>Remove</button>
                    <button onClick={() => handleRestock(item.drug_id)}>Restock</button>
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
          options={options}
          handleInputChange={(e) =>
            setModalData({ ...modalData, [e.target.name]: e.target.value })
          }
          handleSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
};

export default PharmacyDashboard;
