const Membership = require("../models/Membership");
const Client = require("../models/Client");

exports.getClientWithCurrentMembership = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    const currentMembership = await Membership.findOne({
      client: client._id,
      status: "activo",
    })
      .sort("-endDate")
      .limit(1);

    res.json({ client, currentMembership });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addMembership = async (req, res) => {
  try {
    const membershipData = {
      ...req.body,
      client: req.params.clientId,
    };
    const newMembership = new Membership(membershipData);
    await newMembership.save();
    res.status(201).json(newMembership);
  } catch (err) {
    console.error("Error in addMembership:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.renewMembership = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { type, price, paymentMethod, notes } = req.body;

    // Obtener la membresía activa actual
    const currentMembership = await Membership.findOne({
      client: clientId,
      status: "activo",
    });

    if (!currentMembership) {
      return res
        .status(404)
        .json({ message: "No se encontró una membresía activa para renovar" });
    }

    // Marcar la membresía actual como expirada
    currentMembership.status = "expired";
    await currentMembership.save();

    // Calcular la nueva fecha de inicio (un día después del fin de la membresía actual)
    const newStartDate = new Date(currentMembership.endDate);
    newStartDate.setDate(newStartDate.getDate() + 1);

    // Calcular la nueva fecha de fin basada en el tipo de membresía
    let newEndDate = new Date(newStartDate);
    switch (type) {
      case "mensual":
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        break;
      case "trimestral":
        newEndDate.setMonth(newEndDate.getMonth() + 3);
        break;
      case "semestral":
        newEndDate.setMonth(newEndDate.getMonth() + 6);
        break;
      case "anual":
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        break;
      default:
        return res.status(400).json({ message: "Tipo de membresía no válido" });
    }

    // Crear la nueva membresía
    const newMembership = new Membership({
      client: clientId,
      startDate: newStartDate,
      endDate: newEndDate,
      type,
      price,
      paymentMethod,
      notes,
      status: "activo",
    });

    await newMembership.save();

    res.status(200).json({
      message: "Membresía renovada con éxito",
      expiredMembership: currentMembership,
      newMembership: newMembership,
    });
  } catch (err) {
    console.error("Error al renovar la membresía:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.getClientMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find({
      client: req.params.clientId,
    }).sort("-startDate");
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMembership = async (req, res) => {
  try {
    const updatedMembership = await Membership.findOneAndUpdate(
      { _id: req.params.membershipId, client: req.params.clientId },
      req.body,
      { new: true }
    );
    if (!updatedMembership) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }
    res.json(updatedMembership);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findOneAndDelete({
      _id: req.params.membershipId,
      client: req.params.clientId,
    });
    if (!membership) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }
    res.json({ message: "Membresía eliminada con éxito" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
