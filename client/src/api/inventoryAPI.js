import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/inventory';

// Get inventory for a specific user
export const getInventory = async (userId) => {
    const response = await axios.get(`${BASE_URL}/${userId}`);
    return response.data;
};

// Get low stock inventory for a specific user
export const getLowStock = async (userId) => {
    const response = await axios.get(`${BASE_URL}/${userId}/low-stock`);
    return response.data;
};

// Get price history for a specific drug
export const getPriceHistory = async (drugId) => {
    const response = await axios.get(`${BASE_URL}/price-history/${drugId}`);
    return response.data;
};

// Get wholesalers who have a specific drug
export const getWholesalersForDrug = async (drugId) => {
    const response = await axios.get(`${BASE_URL}/wholesalers/${drugId}`);
    return response.data;
};

// Add inventory for a user
export const addInventory = async (userId, data) => {
    try {
        const response = await axios.post(`${BASE_URL}/${userId}/add`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding inventory:', error.response?.data || error.message);
        throw error;
    }
};

// Remove a drug from inventory for a specific user
export const removeDrug = async (userId, drugId) => {
    const response = await axios.delete(`${BASE_URL}/${userId}/remove/${drugId}`);
    return response.data;
};
// Sell a drug from inventory
export const sellDrug = async (userId, drugId, quantity) => {
    const response = await axios.post(`${BASE_URL}/${userId}/sell`, { drugId, quantity });
    return response.data;
};
// View drugs that are about to expire within 30 days
export const viewAlmostExpired = async (userId) => {
    const response = await axios.get(`${BASE_URL}/${userId}/almost-expired`);
    return response.data;
};
// Search for a specific drug in the user's inventory
export const searchDrug = async (userId, searchTerm) => {
    const response = await axios.get(`${BASE_URL}/${userId}/search`, {
        params: { query: searchTerm },
    });
    return response.data;
};


