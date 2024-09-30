import React, { useState, useEffect } from "react";
import { getClients } from "../services/api";
import { Link } from "react-router-dom";

const ClientList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getClients();
        setClients(response.data);
        console.log("CLIENTE ES ?", response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpiringOrExpired = (endDate) => {
    if (!endDate) return false;
    const today = new Date();
    const end = new Date(endDate);
    const daysUntilExpiration = Math.ceil(
      (end - today) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiration <= 7 || daysUntilExpiration < 0;
  };

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nombres y Apellidos
              </th>
              <th scope="col" className="px-6 py-3">
                Teléfono
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha de unión
              </th>
              <th scope="col" className="px-6 py-3">
                Inicio membresía
              </th>
              <th scope="col" className="px-6 py-3">
                Fin membresía
              </th>
              <th scope="col" className="px-6 py-3">
                Estado
              </th>
              <th scope="col" className="px-6 py-3">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr
                key={client._id}
                className={`${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800"
                } border-b dark:border-gray-700`}
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <Link
                    to={`/client/${client._id}/history`}
                    className="hover:underline"
                  >
                    {client.firstName} {client.lastName}
                  </Link>
                </th>

                <td className="px-6 py-4">{client.phoneNumber}</td>
                <td className="px-6 py-4">
                  {formatDate(client.firstJoinDate)}
                </td>
                <td className="px-6 py-4">
                  {formatDate(client.currentMembershipStart)}
                </td>
                <td className="px-6 py-4">
                  {formatDate(client.currentMembershipEnd)}
                </td>
                <td className="px-6 py-4">{client.status}</td>
                <td className="px-6 py-4">
                  {isExpiringOrExpired(client.currentMembershipEnd) && (
                    <Link
                      to={`/renew-membership/${client._id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                    >
                      Renovar
                    </Link>
                  )}
                  <Link
                    to={`/edit-client/${client._id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                  >
                    Editar Cliente
                  </Link>
                  <Link
                    to={`/edit-membership/${client._id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                  >
                    Editar Membresía
                  </Link>
                  <Link
                    to={`/client/${client._id}/history`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Ver Historial
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;
