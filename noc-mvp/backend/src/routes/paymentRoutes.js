const express = require("express");
const router = express.Router();
const {
  createTransaction,
  viewTransactionPage,
  simulatePayment,
  simulateFingerprintPayment,
  getDailyTransactions,
} = require("../controllers/paymentController");

/**
 * @route   POST /api/payments/create
 * @desc    Crea una nuova transazione con ID univoco e salva l'importo
 * @access  Public
 */
router.post("/create", createTransaction);

/**
 * @route   GET /api/payments/transaction/:id
 * @desc    Mostra pagina con QR code e opzione di pagamento via impronta
 * @access  Public
 */
router.get("/transaction/:id", viewTransactionPage);

/**
 * @route   GET /api/payments/pay/:id
 * @desc    Simula il pagamento tramite scansione QR code
 * @access  Public
 */
router.get("/pay/:id", simulatePayment);

/**
 * @route   POST /api/payments/fingerprint
 * @desc    Simula il pagamento immediato con impronta digitale
 * @access  Public
 */
router.post("/fingerprint", simulateFingerprintPayment);

/**
 * @route   GET /api/payments/dashboard
 * @desc    Restituisce le transazioni del giorno selezionato
 * @access  Public (solo per MVP)
 */
router.get("/dashboard", getDailyTransactions);


module.exports = router;
