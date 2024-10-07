import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getClientMemberships, getClientById } from "../services/api";
import { Card, Table, Badge, Spinner } from "flowbite-react";

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
        setMemberships(membershipsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!client)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Perfil e Historial de Membresías de {client.firstName} {client.lastName}
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-4">
            Información del Cliente
          </h3>
          <div className="space-y-2">
            <p>
              <strong>Nombre completo:</strong> {client.firstName}{" "}
              {client.lastName}
            </p>
            <p>
              <strong>Email:</strong> {client.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {client.phoneNumber}
            </p>
            <p>
              <strong>Dirección:</strong> {client.address}
            </p>
            <p>
              <strong>Fecha de nacimiento:</strong>{" "}
              {formatDate(client.dateOfBirth)}
            </p>
          </div>
        </Card>

        <Card>
          <h4 className="text-lg font-semibold mb-4">Contacto de Emergencia</h4>
          <div className="space-y-2">
            <p>
              <strong>Nombre:</strong> {client.emergencyContact.name}
            </p>
            <p>
              <strong>Teléfono:</strong> {client.emergencyContact.phoneNumber}
            </p>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Historial de Membresías</h3>
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Tipo</Table.HeadCell>
            <Table.HeadCell>Fecha de Inicio</Table.HeadCell>
            <Table.HeadCell>Fecha de Fin</Table.HeadCell>
            <Table.HeadCell>Estado</Table.HeadCell>
            <Table.HeadCell>Precio</Table.HeadCell>
            <Table.HeadCell>Notas</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {memberships.map((membership) => (
              <Table.Row
                key={membership._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {membership.type}
                </Table.Cell>
                <Table.Cell>{formatDate(membership.startDate)}</Table.Cell>
                <Table.Cell>{formatDate(membership.endDate)}</Table.Cell>
                <Table.Cell className="p-0">
                  {" "}
                  {/* Eliminamos el padding predeterminado */}
                  <div className="flex items-center justify-center h-full">
                    <Badge
                      size="sm"
                      color={
                        membership.status.toLowerCase() === "activo"
                          ? "success"
                          : "failure"
                      }
                      className="w-full text-center py-1 text-xs font-medium capitalize"
                    >
                      {membership.status}
                    </Badge>
                  </div>
                </Table.Cell>
                <Table.Cell>S/ {membership.price}</Table.Cell>
                <Table.Cell>{membership.notes}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default UserHistory;
