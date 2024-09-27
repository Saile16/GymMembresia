import React, { useState } from 'react';
import { addClient } from '../services/api';

const AddClientForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    emergencyContact: {
      name: '',
      phoneNumber: ''
    },
    membership: {
      startDate: '',
      endDate: '',
      type: '',
      price: '',
      paymentMethod: '',
      notes: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevState => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addClient(formData);
      console.log('Cliente y membresía añadidos:', response.data);
      alert('Cliente y membresía añadidos con éxito');
      // Resetear el formulario
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        emergencyContact: { name: '', phoneNumber: '' },
        membership: { startDate: '', endDate: '', type: '', price: '', paymentMethod: '', notes: '' }
      });
    } catch (error) {
      console.error('Error adding client and membership:', error);
      alert('Error al añadir cliente y membresía');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del cliente */}
      <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nombre" required />
      <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellido" required />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required type="email" />
      <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Teléfono" required />
      <input name="address" value={formData.address} onChange={handleChange} placeholder="Dirección" />
      <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="Fecha de nacimiento" type="date" />
      <input name="emergencyContact.name" value={formData.emergencyContact.name} onChange={handleChange} placeholder="Nombre de contacto de emergencia" />
      <input name="emergencyContact.phoneNumber" value={formData.emergencyContact.phoneNumber} onChange={handleChange} placeholder="Teléfono de contacto de emergencia" />

      {/* Campos de la membresía */}
      <input name="membership.startDate" value={formData.membership.startDate} onChange={handleChange} placeholder="Fecha de inicio" type="date" required />
      <input name="membership.endDate" value={formData.membership.endDate} onChange={handleChange} placeholder="Fecha de finalización" type="date" required />
      <select name="membership.type" value={formData.membership.type} onChange={handleChange} required>
        <option value="">Seleccione el tipo de membresía</option>
        <option value="mensual">Mensual</option>
        <option value="trimestral">Trimestral</option>
        <option value="semestral">Semestral</option>
        <option value="anual">Anual</option>
      </select>
      <input name="membership.price" value={formData.membership.price} onChange={handleChange} placeholder="Precio" type="number" required />
      <select name="membership.paymentMethod" value={formData.membership.paymentMethod} onChange={handleChange} required>
        <option value="">Seleccione el método de pago</option>
        <option value="efectivo">Efectivo</option>
        <option value="transferencia">Transferencia</option>
      </select>
      <textarea name="membership.notes" value={formData.membership.notes} onChange={handleChange} placeholder="Notas"></textarea>

      <button type="submit">Añadir Cliente y Membresía</button>
    </form>
  );
};

export default AddClientForm;