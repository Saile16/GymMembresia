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

  const [errors, setErrors] = useState({});

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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
    // Clear error when user selects a date
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Nombre es requerido";
    if (!formData.lastName) newErrors.lastName = "Apellido es requerido";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Teléfono es requerido";
    if (!formData.address) newErrors.address = "Dirección es requerida";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Fecha de nacimiento es requerida";
    if (!formData.membership.startDate)
      newErrors["membership.startDate"] = "Fecha de inicio es requerida";
    if (!formData.membership.endDate)
      newErrors["membership.endDate"] = "Fecha de fin es requerida";
    if (!formData.membership.type)
      newErrors["membership.type"] = "Tipo de membresía es requerido";
    if (!formData.membership.price)
      newErrors["membership.price"] = "Precio es requerido";
    if (!formData.membership.paymentMethod)
      newErrors["membership.paymentMethod"] = "Método de pago es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    const truncatedValue = numericValue.slice(0, 9);

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: truncatedValue,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: truncatedValue });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
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
      <h2 className="text-4xl font-extrabold dark:text-white">
        Añadir cliente
      </h2>

      <div>
        <FloatingLabel
          variant="filled"
          label="Nombre*"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          color={errors.firstName ? "error" : "success"}
          helperText={errors.firstName}
        />
      </div>

      <div>
        <FloatingLabel
          variant="filled"
          label="Apellido*"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          color={errors.lastName ? "error" : "success"}
          helperText={errors.lastName}
        />
      </div>

      <div>
        <FloatingLabel
          variant="filled"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
      </div>

      <div>
        <FloatingLabel
          variant="filled"
          label="Teléfono*"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          color={errors.phoneNumber ? "error" : "success"}
          helperText={errors.phoneNumber}
          maxLength={9}
          type="tel"
        />
      </div>

      <div>
        <FloatingLabel
          variant="filled"
          label="Dirección*"
          name="address"
          value={formData.address}
          onChange={handleChange}
          color={errors.address ? "error" : "success"}
          helperText={errors.address}
        />
      </div>

      <div>
        <Label htmlFor="dateOfBirth">Fecha de Nacimiento*</Label>
        <Datepicker
          id="dateOfBirth"
          name="dateOfBirth"
          onSelectedDateChanged={(date) =>
            handleDateChange(date, "dateOfBirth")
          }
          value={formData.dateOfBirth}
        />
        {errors.dateOfBirth && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {errors.dateOfBirth}
          </p>
        )}
      </div>

      <h2 className="text-2xl font-extrabold dark:text-white">
        Contacto de Emergencia
      </h2>

      <div>
        <FloatingLabel
          variant="filled"
          label="Nombre de contacto de emergencia"
          name="emergencyContact.name"
          value={formData.emergencyContact.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <FloatingLabel
          variant="filled"
          label="Teléfono de contacto de emergencia"
          name="emergencyContact.phoneNumber"
          value={formData.emergencyContact.phoneNumber}
          onChange={handlePhoneChange}
          maxLength={9}
          type="tel"
        />
      </div>

      <h2 className="text-2xl font-extrabold dark:text-white">Membresía</h2>

      <div>
        <Label htmlFor="membership.startDate">Fecha de Inicio*</Label>
        <Datepicker
          id="membership.startDate"
          name="membership.startDate"
          onSelectedDateChanged={(date) =>
            handleDateChange(date, "membership.startDate")
          }
          value={formData.membership.startDate}
        />
        {errors["membership.startDate"] && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {errors["membership.startDate"]}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="membership.endDate">Fecha de Fin*</Label>
        <Datepicker
          id="membership.endDate"
          name="membership.endDate"
          onSelectedDateChanged={(date) =>
            handleDateChange(date, "membership.endDate")
          }
          value={formData.membership.endDate}
        />
        {errors["membership.endDate"] && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {errors["membership.endDate"]}
          </p>
        )}
      </div>

      <div>
        <Select
          id="membership.type"
          name="membership.type"
          value={formData.membership.type}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione el tipo de membresía*</option>
          <option value="mensual">Mensual</option>
          <option value="trimestral">Trimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
        </Select>
        {errors["membership.type"] && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {errors["membership.type"]}
          </p>
        )}
      </div>

      <div>
        <FloatingLabel
          variant="filled"
          label="Precio*"
          name="membership.price"
          value={formData.membership.price}
          onChange={handleChange}
          type="number"
          color={errors["membership.price"] ? "error" : "success"}
          helperText={errors["membership.price"]}
        />
      </div>

      <div>
        <Select
          id="membership.paymentMethod"
          name="membership.paymentMethod"
          value={formData.membership.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione el método de pago*</option>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </Select>
        {errors["membership.paymentMethod"] && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            {errors["membership.paymentMethod"]}
          </p>
        )}
      </div>

      <div>
        <FloatingLabel
          variant="filled"
          label="Notas"
          name="membership.notes"
          value={formData.membership.notes}
          onChange={handleChange}
        />
      </div>

      <Button type="submit">Guardar</Button>
    </form>
  );
};

export default AddClientForm;
