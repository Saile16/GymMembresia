import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, updateClient } from '../services/api';

const EditClient = () => {
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
    }
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await getClientById(id);
        const clientData = response.data;
        
        // Formatear la fecha de nacimiento para el campo de entrada
        if (clientData.dateOfBirth) {
          const date = new Date(clientData.dateOfBirth);
          clientData.dateOfBirth = date.toISOString().split('T')[0];
        }

        setFormData(clientData);
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    };
    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Asegurarse de que la fecha se envía en el formato correcto
      const updatedFormData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null
      };
      await updateClient(id, updatedFormData);
      alert('Cliente actualizado con éxito');
      navigate('/');
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error al actualizar el cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Cliente</h2>
      <input
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="Nombre"
        required
      />
      <input
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Apellido"
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        type="email"
        required
      />
      <input
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        placeholder="Teléfono"
        required
      />
      <input
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Dirección"
      />
      <input
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        placeholder="Fecha de nacimiento"
        type="date"
      />
      <input
        name="emergencyContact.name"
        value={formData.emergencyContact.name}
        onChange={handleChange}
        placeholder="Nombre de contacto de emergencia"
      />
      <input
        name="emergencyContact.phoneNumber"
        value={formData.emergencyContact.phoneNumber}
        onChange={handleChange}
        placeholder="Teléfono de contacto de emergencia"
      />
      <button type="submit">Actualizar Cliente</button>
    </form>
  );
};

export default EditClient;