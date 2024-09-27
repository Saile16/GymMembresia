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
      status: "active",
    })
      .sort("-endDate")
      .limit(1);

    res.json({ client, currentMembership });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMembership = async (membershipData) => {
  const membership = new Membership(membershipData);
  return await membership.save();
};

exports.addMembership = async (req, res) => {
  try {
    const newMembership = await this.createMembership(req.body);
    res.status(201).json(newMembership);
  } catch (err) {
    console.error("Error in addMembership:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.renewMembership = async (req, res) => {
  try {
    // Marcar la membresía actual como expirada
    await Membership.updateMany(
      { client: req.params.clientId, status: "active" },
      { $set: { status: "expired" } }
    );

    // Crear una nueva membresía
    const newMembership = new Membership({
      client: req.params.clientId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      type: req.body.type,
      price: req.body.price,
      paymentMethod: req.body.paymentMethod,
      notes: req.body.notes,
    });

    await newMembership.save();
    res.status(200).json({
      message: "Membresía renovada con éxito",
      membership: newMembership,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getClientMembershipHistory = async (req, res) => {
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
    const updatedMembership = await Membership.findByIdAndUpdate(
      req.params.id,
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
    const membership = await Membership.findByIdAndDelete(req.params.id);
    if (!membership) {
      return res.status(404).json({ message: "Membresía no encontrada" });
    }
    res.json({ message: "Membresía eliminada con éxito" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
