import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getClients = (page = 1, limit = 10) =>
  axios.get(`${API_URL}/clients`, { params: { page, limit } });

// El resto de las funciones permanecen igual
export const getClientById = (id) => axios.get(`${API_URL}/clients/${id}`);
export const addClient = (clientData) =>
  axios.post(`${API_URL}/clients`, clientData);
export const updateClient = (id, clientData) =>
  axios.put(`${API_URL}/clients/${id}`, clientData);
export const deleteClient = (id) => axios.delete(`${API_URL}/clients/${id}`);

// Rutas de membresías (ahora bajo /clients)
export const getClientWithCurrentMembership = (id) =>
  axios.get(`${API_URL}/clients/${id}/current-membership`);
export const addMembership = (clientId, membershipData) =>
  axios.post(`${API_URL}/clients/${clientId}/membership`, membershipData);
export const renewMembership = (clientId, membershipData) =>
  axios.post(`${API_URL}/clients/${clientId}/renew-membership`, membershipData);
export const updateMembership = (clientId, membershipId, membershipData) =>
  axios.put(
    `${API_URL}/clients/${clientId}/membership/${membershipId}`,
    membershipData
  );
export const deleteMembership = (clientId, membershipId) =>
  axios.delete(`${API_URL}/clients/${clientId}/membership/${membershipId}`);

// Nueva ruta para obtener todas las membresías de un cliente
export const getClientMemberships = (clientId) =>
  axios.get(`${API_URL}/clients/${clientId}/memberships`);
