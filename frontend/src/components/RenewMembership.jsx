import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientWithCurrentMembership, renewMembership } from '../services/api';

const RenewMembership = () => {
  const [client, setClient] = useState(null);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    price: '',
    paymentMethod: '',
    notes: ''
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientAndMembership = async () => {
      try {
        const response = await getClientWithCurrentMembership(id);
        setClient(response.data.client);
        setCurrentMembership(response.data.currentMembership);
      } catch (error) {
        console.error('Error fetching client and membership:', error);
      }
    };
    fetchClientAndMembership();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await renewMembership(id, formData);
      alert('Membresía renovada con éxito');
      navigate('/');
    } catch (error) {
      console.error('Error renewing membership:', error);
      alert('Error al renovar la membresía');
    }
  };

  if (!client || !currentMembership) return <div>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Renovar Membresía de {client.firstName} {client.lastName}</h2>
      <p>Membresía actual expira el: {new Date(currentMembership.endDate).toLocaleDateString()}</p>
      <select name="type" value={formData.type} onChange={handleChange} required>
        <option value="">Seleccione el tipo de membresía</option>
        <option value="mensual">Mensual</option>
        <option value="trimestral">Trimestral</option>
        <option value="semestral">Semestral</option>
        <option value="anual">Anual</option>
      </select>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Precio"
        required
      />
      <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
        <option value="">Seleccione el método de pago</option>
        <option value="efectivo">Efectivo</option>
        <option value="transferencia">Transferencia</option>
      </select>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Notas adicionales"
      />
      <button type="submit">Renovar Membresía</button>
    </form>
  );
};

export default RenewMembership;