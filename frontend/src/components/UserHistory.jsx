import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getClientMemberships, getClientById } from '../services/api';

const UserHistory = () => {
  const [memberships, setMemberships] = useState([]);
  const [client, setClient] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientResponse = await getClientById(id);
        setClient(clientResponse.data);

        const membershipsResponse = await getClientMemberships(id);
        console.log("MEMBERSHIP?",membershipsResponse)
        setMemberships(membershipsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!client) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Perfil e Historial de Membresías de {client.firstName} {client.lastName}</h2>
      
      <section>
        <h3>Información del Cliente</h3>
        <p><strong>Nombre completo:</strong> {client.firstName} {client.lastName}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Teléfono:</strong> {client.phoneNumber}</p>
        <p><strong>Dirección:</strong> {client.address}</p>
        <p><strong>Fecha de nacimiento:</strong> {formatDate(client.dateOfBirth)}</p>
        <h4>Contacto de Emergencia</h4>
        <p><strong>Nombre:</strong> {client.emergencyContact.name}</p>
        <p><strong>Teléfono:</strong> {client.emergencyContact.phoneNumber}</p>
      </section>

      <section>
        <h3>Historial de Membresías</h3>
        <table>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Fin</th>
              <th>Estado</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map(membership => (
              <tr key={membership._id}>
                <td>{membership.type}</td>
                <td>{formatDate(membership.startDate)}</td>
                <td>{formatDate(membership.endDate)}</td>
                <td>{membership.status}</td>
                <td>{membership.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserHistory;