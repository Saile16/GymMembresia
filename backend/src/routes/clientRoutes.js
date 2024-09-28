const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const membershipController = require("../controllers/membershipController");

// Rutas de clientes
router.get("/", clientController.getClients); // Corregido: quitamos '/clients'
router.get("/:id", clientController.getClientById);
router.post("/", clientController.addClient);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

// Rutas de membresías
router.get(
  "/:id/current-membership",
  membershipController.getClientWithCurrentMembership
);
router.post("/:clientId/membership", membershipController.addMembership);
router.post(
  "/:clientId/renew-membership",
  membershipController.renewMembership
);
router.get("/:clientId/memberships", membershipController.getClientMemberships);
router.put(
  "/:clientId/membership/:membershipId",
  membershipController.updateMembership
);
router.delete(
  "/:clientId/membership/:membershipId",
  membershipController.deleteMembership
);

module.exports = router;
