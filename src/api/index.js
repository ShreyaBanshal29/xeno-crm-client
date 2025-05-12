import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Customer endpoints
export const createCustomer = (customerData) => apiClient.post('/customers', customerData);
export const getCustomers = () => apiClient.get('/customers');

// Order endpoints
export const createOrder = (orderData) => apiClient.post('/orders', orderData);
export const getCustomerOrders = (customerId) => apiClient.get(`/orders/${customerId}`);

// Campaign endpoints
export const createCampaign = (campaignData) => apiClient.post('/campaigns', campaignData);
export const getCampaigns = () => apiClient.get('/campaigns');
export const previewAudience = (rules) => apiClient.post('/campaigns/preview', { rules });

// AI endpoints
export const generateRules = (prompt) => apiClient.post('/ai/generate-rules', { prompt });

export default apiClient;