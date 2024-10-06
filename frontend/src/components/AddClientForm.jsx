import React, { useState } from "react";
import { addClient } from "../services/api";
import {
  FloatingLabel,
  Button,
  Select,
  Datepicker,
  Label,
} from "flowbite-react";

const AddClientForm = () => {
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
    membership: {
      startDate: "",
      endDate: "",
      type: "",
      price: "",
      paymentMethod: "",
      notes: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (date, name) => {
    const formattedDate = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: formattedDate },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: formattedDate }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convertir las fechas a objetos Date antes de enviar
      const formDataToSend = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth.split("/").reverse().join("-"))
          : null,
        membership: {
          ...formData.membership,
          startDate: formData.membership.startDate
            ? new Date(
                formData.membership.startDate.split("/").reverse().join("-")
              )
            : null,
          endDate: formData.membership.endDate
            ? new Date(
                formData.membership.endDate.split("/").reverse().join("-")
              )
            : null,
        },
      };

      const response = await addClient(formDataToSend);
      console.log("Cliente y membresía añadidos:", response.data);
      alert("Cliente y membresía añadidos con éxito");
      // Resetear el formulario
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        emergencyContact: { name: "", phoneNumber: "" },
        membership: {
          startDate: "",
          endDate: "",
          type: "",
          price: "",
          paymentMethod: "",
          notes: "",
        },
      });
    } catch (error) {
      console.error("Error adding client and membership:", error);
      alert("Error al añadir cliente y membresía");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <h2 class="text-4xl font-extrabold dark:text-white">Añadir cliente</h2>
      {/* Campos del cliente */}
      <FloatingLabel
        variant="filled"
        label="Nombre"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <FloatingLabel
        variant="filled"
        label="Apellido"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <FloatingLabel
        variant="filled"
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        type="email"
      />
      <FloatingLabel
        variant="filled"
        label="Teléfono"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
      />
      <FloatingLabel
        variant="filled"
        label="Dirección"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />
      <div>
        <Label htmlFor="startDate">Fecha de Nacimiento</Label>
        <Datepicker
          language="es-ES"
          labelTodayButton="Hoy"
          labelClearButton="Limpiar"
          name="dateOfBirth"
          onSelectedDateChanged={(date) =>
            handleDateChange(date, "dateOfBirth")
          }
          value={formData.dateOfBirth}
        />
      </div>
      <FloatingLabel
        variant="filled"
        label="Nombre de contacto de emergencia"
        name="emergencyContact.name"
        value={formData.emergencyContact.name}
        onChange={handleChange}
      />
      <FloatingLabel
        variant="filled"
        label="Teléfono de contacto de emergencia"
        name="emergencyContact.phoneNumber"
        value={formData.emergencyContact.phoneNumber}
        onChange={handleChange}
      />

      {/* Campos de la membresía */}

      <h2 class="text-2xl font-extrabold dark:text-white">Membresía</h2>

      <div>
        <Label htmlFor="startDate">Fecha de Inicio</Label>
        <Datepicker
          language="es-ES"
          labelTodayButton="Hoy"
          labelClearButton="Limpiar"
          name="membership.startDate"
          onSelectedDateChanged={(date) =>
            handleDateChange(date, "membership.startDate")
          }
          value={formData.membership.startDate}
        />
      </div>
      <div>
        <Label htmlFor="startDate">Fecha de Fin</Label>
        <Datepicker
          language="es-ES"
          labelTodayButton="Hoy"
          labelClearButton="Limpiar"
          name="membership.endDate"
          onSelectedDateChanged={(date) =>
            handleDateChange(date, "membership.endDate")
          }
          value={formData.membership.endDate}
        />
      </div>
      <Select
        id="membership.type"
        name="membership.type"
        value={formData.membership.type}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione el tipo de membresía</option>
        <option value="mensual">Mensual</option>
        <option value="trimestral">Trimestral</option>
        <option value="semestral">Semestral</option>
        <option value="anual">Anual</option>
      </Select>
      <FloatingLabel
        variant="filled"
        label="Precio"
        name="membership.price"
        value={formData.membership.price}
        onChange={handleChange}
        type="number"
        required
      />
      <Select
        id="membership.paymentMethod"
        name="membership.paymentMethod"
        value={formData.membership.paymentMethod}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione el método de pago</option>
        <option value="efectivo">Efectivo</option>
        <option value="transferencia">Transferencia</option>
      </Select>
      <FloatingLabel
        variant="filled"
        label="Notas"
        name="membership.notes"
        value={formData.membership.notes}
        onChange={handleChange}
      />

      <Button type="submit">Añadir Cliente y Membresía</Button>
    </form>
  );
};

export default AddClientForm;
