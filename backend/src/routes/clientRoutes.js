const express = require("express");
const router = express.Router();
const {
  getClients,
  addClient,
  getExpiringMemberships,
} = require("../controllers/clientController");

router.get("/", getClients);
router.post("/", addClient);
router.get("/expiring", getExpiringMemberships);

module.exports = router;
