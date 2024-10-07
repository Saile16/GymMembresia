const Client = require("../models/Client");
const Membership = require("../models/Membership");
const membershipController = require("./membershipController");

exports.getClients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalClients = await Client.countDocuments();

    const clients = await Client.find()
      .select("firstName lastName phoneNumber firstJoinDate")
      .skip(skip)
      .limit(limit);

    const clientsWithMembership = await Promise.all(
      clients.map(async (client) => {
        const currentMembership = await Membership.findOne({
          client: client._id,
          status: "activo",
        }).sort("-endDate");

        return {
          _id: client._id,
          firstName: client.firstName,
          lastName: client.lastName,
          phoneNumber: client.phoneNumber,
          firstJoinDate: client.firstJoinDate,
          currentMembershipStart: currentMembership
            ? currentMembership.startDate
            : null,
          currentMembershipEnd: currentMembership
            ? currentMembership.endDate
            : null,
          status: currentMembership ? currentMembership.status : null,
        };
      })
    );

    res.json({
      clients: clientsWithMembership,
      currentPage: page,
      totalPages: Math.ceil(totalClients / limit),
      totalClients,
    });
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    console.log("CLIENTE ES ?", client);
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
      const membership = new Membership(membershipData);
      newMembership = await membership.save();
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
