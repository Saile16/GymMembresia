const Client = require("../models/Client");

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addClient = async (req, res) => {
  const client = new Client({
    name: req.body.name,
    email: req.body.email,
    membershipStart: req.body.membershipStart,
    membershipEnd: req.body.membershipEnd,
  });

  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getExpiringMemberships = async (req, res) => {
  const today = new Date();
  const inOneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  try {
    const expiringClients = await Client.find({
      membershipEnd: { $gte: today, $lte: inOneWeek },
      active: true,
    });
    res.json(expiringClients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
