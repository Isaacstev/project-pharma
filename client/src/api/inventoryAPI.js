import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/inventory';

// Get inventory for a specific user
export const getInventory = async (userId, role) => {
    const response = await axios.get(`${BASE_URL}/${userId}`, {
      params: { role },
    });
    return response.data;
};

// Get low stock inventory for a specific user with a customizable threshold
export const getLowStock = async (userId, threshold = 10) => {
    const response = await axios.get(`${BASE_URL}/${userId}/low-stock`, {
        params: { threshold },
    });
    return response.data;
};

// Get price history for a specific drug
export const getPriceHistory = async (drugId) => {
    const response = await axios.get(`${BASE_URL}/price-history/${drugId}`);
    return response.data;
};

// Add inventory for a user
export const addInventory = async (userId, data) => {
    const role = localStorage.getItem('role'); // Retrieve the role from localStorage
  
    if (!role) {
      throw new Error('Role is missing. Please ensure the user is logged in.');
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}/${userId}/add?role=${role}`, // Include role as a query parameter
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding inventory:', error.response?.data || error.message);
      throw error;
    }
  };  

// Update inventory for a specific drug
export const updateInventory = async (inventoryId, data) => {
    try {
        const response = await axios.patch(`${BASE_URL}/update/${inventoryId}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating inventory:', error.response?.data || error.message);
        throw error;
    }
};

// Remove a drug from inventory for a specific user
export const removeDrug = async (userId, inventoryId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${userId}/remove/${inventoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing drug:', error.response?.data || error.message);
        throw error;
    }
};

// Sell a drug from inventory
export const sellDrug = async (userId, drugId, quantity) => {
    const response = await axios.post(`${BASE_URL}/${userId}/sell`, { drugId, quantity });
    return response.data;
};

// View drugs that are about to expire within a customizable number of days
export const viewAlmostExpired = async (userId, days = 30) => {
    const response = await axios.get(`${BASE_URL}/${userId}/almost-expired`, {
        params: { days },
    });
    return response.data;
};

// Search for a specific drug in the user's inventory
export const searchDrug = async (searchTerm) => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: { query: searchTerm },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching drug:', error.response?.data || error.message);
        throw error;
    }
};

// Get wholesalers who have a specific drug
export const getWholesalersForDrug = async (drugId) => {
    try {
        const response = await axios.get(`${BASE_URL}/wholesalers/${drugId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching wholesalers for drug:', error.response?.data || error.message);
        throw error;
    }
};

// Save or update user settings (thresholds)
export const saveSettings = async (userId, settings) => {
    try {
        const response = await axios.put(`${BASE_URL}/${userId}/settings`, settings, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving settings:', error.response?.data || error.message);
        throw error;
    }
};

// Fetch user settings (thresholds)
export const getSettings = async (userId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${userId}/settings`);
        return response.data;
    } catch (error) {
        console.error('Error fetching settings:', error.response?.data || error.message);
        throw error;
    }
};
