import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientWithCurrentMembership, updateMembership } from '../services/api';

const EditMembership = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    type: '',
    price: '',
    paymentMethod: '',
    notes: ''
  });
  const [client, setClient] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientAndMembership = async () => {
      try {
        const response = await getClientWithCurrentMembership(id);
        setClient(response.data.client);
        
        if (response.data.currentMembership) {
          const { startDate, endDate, ...rest } = response.data.currentMembership;
          setFormData({
            ...rest,
            startDate: new Date(startDate).toISOString().split('T')[0],
            endDate: new Date(endDate).toISOString().split('T')[0]
          });
        }
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
      await updateMembership(id, formData._id, formData);
      alert('Membresía actualizada con éxito');
      navigate('/');
    } catch (error) {
      console.error('Error updating membership:', error);
      alert('Error al actualizar la membresía');
    }
  };

  if (!client) return <div>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Membresía de {client.firstName} {client.lastName}</h2>
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        required
      />
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
      <button type="submit">Actualizar Membresía</button>
    </form>
  );
};

export default EditMembership;