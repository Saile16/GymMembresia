import React, { useState } from "react";
import { addClient } from "../services/api";
import { Datepicker, Label, Select } from "flowbite-react";

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

  const handleDateOfBirthChange = (date) => {
    if (date) {
      // Formatear la fecha en un formato ISO para la base de datos
      const isoFormattedDate = new Date(date).toISOString().split("T")[0]; // "YYYY-MM-DD"
      setFormData((prevState) => ({
        ...prevState,
        dateOfBirth: isoFormattedDate, // Guardar en formato ISO
      }));
    }
  };

  const handleDateChange = (date, type) => {
    if (date) {
      // Formatear la fecha en un formato ISO para la base de datos
      const isoFormattedDate = new Date(date).toISOString().split("T")[0]; // "YYYY-MM-DD"
      setFormData((prevState) => ({
        ...prevState,
        membership: {
          ...prevState.membership,
          [type]: isoFormattedDate, // Guardar en formato ISO
        },
      }));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addClient(formData);
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Añadir Nuevo Cliente
      </h2>

      {/* Campos del cliente */}
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="firstName"
            id="floating_first_name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={formData.firstName}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_first_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Nombres
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="lastName"
            id="floating_last_name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={formData.lastName}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_last_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Apellidos
          </label>
        </div>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="email"
          name="email"
          id="floating_email"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={formData.email}
          onChange={handleChange}
        />
        <label
          htmlFor="floating_email"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Correo
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="tel"
          name="phoneNumber"
          id="floating_phone"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <label
          htmlFor="floating_phone"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Teléfono
        </label>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="text"
          name="address"
          id="floating_address"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.address}
          onChange={handleChange}
        />
        <label
          htmlFor="floating_address"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Dirección
        </label>
      </div>

      <div className="max-w-md">
        <div className="mb-2 block">
          <Label htmlFor="dateOfBirth" value="Fecha de nacimiento" />
        </div>
        <Datepicker
          id="dateOfBirth"
          language="es-ES"
          value={
            formData.dateOfBirth
              ? new Date(formData.dateOfBirth).toLocaleDateString("es-ES")
              : ""
          }
          onSelectedDateChanged={handleDateOfBirthChange}
          showClearButton={true}
          showTodayButton={true}
        />
      </div>

      {/* Contacto de emergencia */}
      <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="emergencyContact.name"
            id="floating_emergency_name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={formData.emergencyContact.name}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_emergency_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Contacto de emergencia
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="tel"
            name="emergencyContact.phoneNumber"
            id="floating_emergency_phone"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={formData.emergencyContact.phoneNumber}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_emergency_phone"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Teléfono de emergencia
          </label>
        </div>
      </div>

      {/* Campos de la membresía */}
      <h3 className="text-xl font-bold mb-4 mt-8">Información de Membresía</h3>

      <div className="mb-4">
        <label
          htmlFor="startDate"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Fecha de inicio
        </label>
        <Datepicker
          id="startDate"
          language="es-ES"
          value={
            formData.membership.startDate
              ? new Date(formData.membership.startDate).toLocaleDateString(
                  "es-ES"
                )
              : ""
          }
          onSelectedDateChanged={(date) => handleDateChange(date, "startDate")}
          showClearButton={false}
          showTodayButton={false}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="endDate"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Fecha de fin
        </label>
        <Datepicker
          id="endDate"
          language="es-ES"
          value={
            formData.membership.endDate
              ? new Date(formData.membership.endDate).toLocaleDateString(
                  "es-ES"
                )
              : ""
          }
          onSelectedDateChanged={(date) => handleDateChange(date, "endDate")}
          showClearButton={false}
          showTodayButton={false}
        />
      </div>

      <div className="max-w-md">
        <div className="mb-2 block">
          <Label htmlFor="membership_type" value="Tipo de membresía" />
        </div>
        <Select
          id="membership_type"
          name="membership.type"
          required
          value={formData.membership.type}
          onChange={handleChange}
        >
          <option value="">Seleccione el tipo de membresía</option>
          <option value="mensual">Mensual</option>
          <option value="trimestral">Trimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
        </Select>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="membership.price"
          id="floating_price"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          value={formData.membership.price}
          onChange={handleChange}
        />
        <label
          htmlFor="floating_price"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Precio
        </label>
      </div>

      <div className="max-w-md">
        <div className="mb-2 block">
          <Label htmlFor="payment_method" value="Método de pago" />
        </div>
        <Select
          id="payment_method"
          name="membership.paymentMethod"
          required
          value={formData.membership.paymentMethod}
          onChange={handleChange}
        >
          <option value="">Seleccione el método de pago</option>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </Select>
      </div>

      <div className="relative z-0 w-full mb-5 group">
        <textarea
          name="membership.notes"
          id="floating_notes"
          rows="4"
          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          value={formData.membership.notes}
          onChange={handleChange}
        ></textarea>
        <label
          htmlFor="floating_notes"
          className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Notas adicionales
        </label>
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Añadir Cliente y Membresía
      </button>
    </form>
  );
};

export default AddClientForm;
