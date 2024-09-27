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
router.post("/memberships", membershipController.addMembership);
router.post(
  "/:clientId/renew-membership",
  membershipController.renewMembership
);
router.get(
  "/:clientId/membership-history",
  membershipController.getClientMembershipHistory
);
router.put("/memberships/:id", membershipController.updateMembership);
router.delete("/memberships/:id", membershipController.deleteMembership);

module.exports = router;
