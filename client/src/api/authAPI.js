import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth';

// Login API
export const login = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return response.data; 
};

// Sign-up API
export const signUp = async (formData) => {
    const response = await axios.post(`${BASE_URL}/signup`, formData);
    return response.data;
};

