import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/orders';

// Place an order
export const placeOrder = async ({ pharmacyId, wholesalerId, drugName, quantity, paymentMethod }) => {
  try {
    const response = await axios.post(`${BASE_URL}/place`, {
      pharmacyId,
      wholesalerId,
      drugName,
      quantity,
      paymentMethod,
    });
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to place order';
    throw new Error(errorMessage);
  }
};

// Get all orders for a specific user and role
export const getOrders = async (userId, role) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        userId,
        role,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
    throw new Error(errorMessage);
  }
};

// Confirm an order
export const confirmOrder = async (orderId) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${orderId}/confirm`);
    return response.data;
  } catch (error) {
    console.error('Error confirming order:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to confirm order';
    throw new Error(errorMessage);
  }
};

// Deny an order
export const denyOrder = async (orderId) => {
  try {
    const response = await axios.patch(`${BASE_URL}/${orderId}/deny`);
    return response.data;
  } catch (error) {
    console.error('Error denying order:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to deny order';
    throw new Error(errorMessage);
  }
};

// Get all wholesalers
export const getWholesalers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/wholesalers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wholesalers:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to fetch wholesalers';
    throw new Error(errorMessage);
  }
};

// Get wholesalers with a specific drug for restocking
export const getWholesalersForDrug = async (drugId) => {
  try {
    const response = await axios.get(`${BASE_URL}/wholesalers/${drugId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wholesalers for drug:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Failed to fetch wholesalers for drug';
    throw new Error(errorMessage);
  }
};
