// routes/pispRoutes.js

const express = require("express");
const router = express.Router();

const { sendPaymentToPISP } = require("../controllers/pispController");

/**
 * @route   POST /api/pisp/send
 * @desc    Simula l'invio di un pagamento a un PISP esterno (es. Fabrick)
 * @access  Public
 */
router.post("/send", sendPaymentToPISP);

module.exports = router;