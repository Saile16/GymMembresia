import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getClientWithCurrentMembership,
  renewMembership,
} from "../services/api";
import {
  Card,
  Select,
  TextInput,
  Textarea,
  Button,
  Label,
} from "flowbite-react";

const RenewMembership = () => {
  const [client, setClient] = useState(null);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    price: "",
    paymentMethod: "",
    notes: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientAndMembership = async () => {
      try {
        const response = await getClientWithCurrentMembership(id);
        setClient(response.data.client);
        setCurrentMembership(response.data.currentMembership);
      } catch (error) {
        console.error("Error fetching client and membership:", error);
      }
    };
    fetchClientAndMembership();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await renewMembership(id, formData);
      alert("Membresía renovada con éxito");
      navigate("/");
    } catch (error) {
      console.error("Error renewing membership:", error);
      alert("Error al renovar la membresía");
    }
  };

  if (!client || !currentMembership) return <div>Cargando...</div>;

  return (
    <Card className="max-w-sm mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center mb-4">
          Renovar Membresía de {client.firstName} {client.lastName}
        </h2>
        <p className="text-center mb-4">
          Membresía actual expira el:{" "}
          {new Date(currentMembership.endDate).toLocaleDateString()}
        </p>

        <div>
          <Label htmlFor="type">Tipo de Membresía</Label>
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
          <Label htmlFor="paymentMethod">Método de Pago</Label>
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
          <Label htmlFor="notes">Notas Adicionales</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notas adicionales"
            rows={4}
          />
        </div>

        <Button type="submit" color="blue">
          Renovar Membresía
        </Button>
      </form>
    </Card>
  );
};

export default RenewMembership;
