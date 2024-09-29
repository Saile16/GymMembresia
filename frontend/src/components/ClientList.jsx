import React, { useState, useEffect } from 'react';
import { getClients } from '../services/api';
import { Link } from 'react-router-dom';

const ClientList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getClients();
        setClients(response.data);
        console.log("CLIENTE ES ?",response.data)
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpiringOrExpired = (endDate) => {
    if (!endDate) return false;
    const today = new Date();
    const end = new Date(endDate);
    const daysUntilExpiration = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 7 || daysUntilExpiration < 0;
  };

  return (
    <div>
      <h2>Lista de Clientes</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Fecha de unión al gym</th>
            <th>Inicio de membresía actual</th>
            <th>Fin de membresía actual</th>
            <th>Estado membresia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client._id}>
              <td><Link to={`/client/${client._id}/history`}>{client.firstName}</Link></td>
              
              
              <td>{client.lastName}</td>
              <td>{client.phoneNumber}</td>
              <td>{formatDate(client.firstJoinDate)}</td>
              <td>{formatDate(client.currentMembershipStart)}</td>
              <td>{formatDate(client.currentMembershipEnd)}</td>
              <td>{client.status}</td>
              <td>
                {isExpiringOrExpired(client.currentMembershipEnd) && (
                  <Link to={`/renew-membership/${client._id}`}>
                    <button>Renovar Membresía</button>
                  </Link>
                ) }
                <Link to={`/edit-client/${client._id}`}>
                  <button>Editar Cliente</button>
                </Link>
                <Link to={`/edit-membership/${client._id}`}>
                    <button>Editar Membresía</button>
                  </Link>
                  <Link to={`/client/${client._id}/history`}>Ver Historial</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;