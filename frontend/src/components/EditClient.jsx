import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClientById, updateClient } from "../services/api";
import { FloatingLabel, Button, Datepicker } from "flowbite-react";

const EditClient = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    emergencyContact: {
      name: "",
      phoneNumber: "",
    },
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await getClientById(id);
        const clientData = response.data;

        // Si hay fecha de nacimiento, la formateamos para la visualización
        if (clientData.dateOfBirth) {
          clientData.dateOfBirth = new Date(clientData.dateOfBirth)
            .toISOString()
            .split("T")[0];
        }

        setFormData(clientData);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };
    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateOfBirthChange = (date) => {
    if (date) {
      // Formatear la fecha en un formato ISO para la base de datos
      const isoFormattedDate = new Date(date).toISOString().split("T")[0]; // "YYYY-MM-DD"
      setFormData((prevState) => ({
        ...prevState,
        dateOfBirth: isoFormattedDate, // Guardar en formato ISO
      }));
    } else {
      // Si se borra la fecha
      setFormData((prevState) => ({
        ...prevState,
        dateOfBirth: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClient(id, formData);
      alert("Cliente actualizado con éxito");
      navigate("/");
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Error al actualizar el cliente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editar Cliente</h2>

      <FloatingLabel
        variant="standard"
        label="Nombre"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <FloatingLabel
        variant="standard"
        label="Apellido"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <FloatingLabel
        variant="standard"
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <FloatingLabel
        variant="standard"
        label="Teléfono"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <FloatingLabel
        variant="standard"
        label="Dirección"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />

      <div>
        <label
          htmlFor="dateOfBirth"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Fecha de nacimiento
        </label>
        <Datepicker
          id="dateOfBirth"
          language="es-ES"
          value={
            formData.dateOfBirth
              ? new Date(formData.dateOfBirth).toLocaleDateString("es-ES")
              : ""
          }
          onSelectedDateChanged={handleDateOfBirthChange}
          showClearButton={false}
          showTodayButton={false}
        />
      </div>

      <FloatingLabel
        variant="standard"
        label="Nombre de contacto de emergencia"
        name="emergencyContact.name"
        value={formData.emergencyContact.name}
        onChange={handleChange}
      />
      <FloatingLabel
        variant="standard"
        label="Teléfono de contacto de emergencia"
        name="emergencyContact.phoneNumber"
        value={formData.emergencyContact.phoneNumber}
        onChange={handleChange}
      />

      <Button type="submit">Actualizar Cliente</Button>
    </form>
  );
};

export default EditClient;
