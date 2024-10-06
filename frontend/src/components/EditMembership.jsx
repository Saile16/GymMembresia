import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getClientWithCurrentMembership,
  updateMembership,
} from "../services/api";
import {
  Datepicker,
  Select,
  TextInput,
  Textarea,
  Button,
  Label,
} from "flowbite-react";

const EditMembership = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    type: "",
    price: "",
    paymentMethod: "",
    notes: "",
  });
  const [client, setClient] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientAndMembership = async () => {
      try {
        const response = await getClientWithCurrentMembership(id);
        setClient(response.data.client);

        if (response.data.currentMembership) {
          const { startDate, endDate, ...rest } =
            response.data.currentMembership;
          setFormData({
            ...rest,
            startDate: new Date(startDate).toLocaleDateString("es-ES"),
            endDate: new Date(endDate).toLocaleDateString("es-ES"),
          });
        }
      } catch (error) {
        console.error("Error fetching client and membership:", error);
      }
    };
    fetchClientAndMembership();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, name) => {
    const formattedDate = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setFormData((prev) => ({ ...prev, [name]: formattedDate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMembership(id, formData._id, formData);
      alert("Membresía actualizada con éxito");
      navigate("/");
    } catch (error) {
      console.error("Error updating membership:", error);
      alert("Error al actualizar la membresía");
    }
  };

  if (!client) return <div>Cargando...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Editar Membresía de {client.firstName} {client.lastName}
      </h2>

      <div>
        <Label htmlFor="startDate">Fecha de inicio</Label>
        <Datepicker
          id="startDate"
          name="startDate"
          language="es-ES"
          labelTodayButton="Hoy"
          labelClearButton="Limpiar"
          onSelectedDateChanged={(date) => handleDateChange(date, "startDate")}
          value={formData.startDate}
          required
          showClearButton={false}
          showTodayButton={false}
        />
      </div>

      <div>
        <Label htmlFor="endDate">Fecha de finalización</Label>
        <Datepicker
          id="endDate"
          name="endDate"
          language="es-ES"
          labelTodayButton="Hoy"
          labelClearButton="Limpiar"
          onSelectedDateChanged={(date) => handleDateChange(date, "endDate")}
          value={formData.endDate}
          showClearButton={false}
          showTodayButton={false}
          required
        />
      </div>

      <div>
        <Label htmlFor="type">Tipo de membresía</Label>
        <Select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione el tipo de membresía</option>
          <option value="mensual">Mensual</option>
          <option value="trimestral">Trimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="price">Precio</Label>
        <TextInput
          id="price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Precio"
          required
        />
      </div>

      <div>
        <Label htmlFor="paymentMethod">Método de pago</Label>
        <Select
          id="paymentMethod"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione el método de pago</option>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notas adicionales</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notas adicionales"
          rows={4}
        />
      </div>

      <Button type="submit">Actualizar Membresía</Button>
    </form>
  );
};

export default EditMembership;
