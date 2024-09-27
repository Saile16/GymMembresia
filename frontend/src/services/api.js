import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getClients = () => axios.get(`${API_URL}/clients`);
export const addClient = (clientData) => axios.post(`${API_URL}/clients`, clientData);
export const getExpiringMemberships = () => axios.get(`${API_URL}/clients/expiring`);