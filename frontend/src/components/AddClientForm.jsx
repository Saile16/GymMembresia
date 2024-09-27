import React, { useState } from 'react';
import { addClient } from '../services/api';

const AddClientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    membershipStart: '',
    membershipEnd: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addClient(formData);
      alert('Cliente añadido con éxito');
      setFormData({ name: '', email: '', membershipStart: '', membershipEnd: '' });
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error al añadir cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombre" required />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required type="email" />
      <input name="membershipStart" value={formData.membershipStart} onChange={handleChange} placeholder="Inicio de membresía" required type="date" />
      <input name="membershipEnd" value={formData.membershipEnd} onChange={handleChange} placeholder="Fin de membresía" required type="date" />
      <button type="submit">Añadir Cliente</button>
    </form>
  );
};

export default AddClientForm;