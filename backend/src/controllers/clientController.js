const Client = require("../models/Client");
const Membership = require("../models/Membership");
const membershipController = require("./membershipController");
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
    console.log("LOS CLIENTES SON", clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addClient = async (req, res) => {
  try {
    const clientData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      dateOfBirth: req.body.dateOfBirth,
      emergencyContact: req.body.emergencyContact,
    };

    const client = new Client(clientData);
    const newClient = await client.save();

    let newMembership = null;
    if (req.body.membership) {
      const membershipData = {
        ...req.body.membership,
        client: newClient._id,
      };
      newMembership = await membershipController.createMembership(
        membershipData
      );
    }

    res.status(201).json({ client: newClient, membership: newMembership });
  } catch (err) {
    console.error("Error in addClient:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    await Membership.deleteMany({ client: req.params.id });
    res.json({ message: "Cliente eliminado con éxito" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
