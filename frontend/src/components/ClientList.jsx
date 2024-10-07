import React, { useState, useEffect } from "react";
import { getClients } from "../services/api";
import { Link } from "react-router-dom";
import { Table, Badge, Button, Pagination, TextInput } from "flowbite-react";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const clientsPerPage = 10; // Puedes ajustar este número según tus necesidades
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClients();
  }, [currentPage, clientsPerPage, searchQuery]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await getClients(
        currentPage,
        clientsPerPage,
        searchQuery
      );
      setClients(response.data.clients);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

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

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <TextInput
          type="text"
          placeholder="Buscar por nombre..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Nombres y Apellidos</Table.HeadCell>
          <Table.HeadCell>Teléfono</Table.HeadCell>
          <Table.HeadCell>Fecha de unión</Table.HeadCell>
          <Table.HeadCell>Inicio membresía</Table.HeadCell>
          <Table.HeadCell>Fin membresía</Table.HeadCell>
          <Table.HeadCell>Estado</Table.HeadCell>
          <Table.HeadCell>Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {clients.map((client) => (
            <Table.Row
              key={client._id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Link
                  to={`/client/${client._id}/history`}
                  className="hover:underline"
                >
                  {client.firstName} {client.lastName}
                </Link>
              </Table.Cell>
              <Table.Cell>{client.phoneNumber}</Table.Cell>
              <Table.Cell>{formatDate(client.firstJoinDate)}</Table.Cell>
              <Table.Cell>
                {formatDate(client.currentMembershipStart)}
              </Table.Cell>
              <Table.Cell>{formatDate(client.currentMembershipEnd)}</Table.Cell>
              <Table.Cell>
                <Badge
                  size="sm"
                  color={client.status === "activo" ? "success" : "failure"}
                >
                  {client.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-2">
                  {isExpiringOrExpired(client.currentMembershipEnd) && (
                    <Button
                      as={Link}
                      to={`/renew-membership/${client._id}`}
                      size="xs"
                      color="warning"
                    >
                      Renovar
                    </Button>
                  )}
                  <Button as={Link} to={`/edit-client/${client._id}`} size="xs">
                    Editar Cliente
                  </Button>
                  <Button
                    as={Link}
                    to={`/edit-membership/${client._id}`}
                    size="xs"
                  >
                    Editar Membresía
                  </Button>
                  <Button
                    as={Link}
                    to={`/client/${client._id}/history`}
                    size="xs"
                    color="light"
                  >
                    Ver Historial
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <div className="flex overflow-x-auto sm:justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showIcons={true}
          previousLabel="Atrás"
          nextLabel="Siguiente"
        />
      </div>
    </div>
  );
};

export default ClientList;
