// controllers/pispController.js
/**
 * @desc    Simula l'invio di un pagamento a un PISP esterno
 * @route   POST /api/pisp/send
 * 
 * ⚠️ ATTENZIONE:
 * Questa logica di errore è solo per simulazione nell’MVP.
 * Quando collegherai un vero PISP, dovrai riscrivere questa funzione
 * in modo che analizzi la risposta reale del PISP e trasmetta al POS
 * gli errori veri restituiti dal PISP (es. fondi insufficienti, limiti superati, ecc.).
 */

const sendPaymentToPISP = (req, res) => {
  const { transactionId, iban, amount } = req.body;

  if (!transactionId || !iban || !amount) {
    return res.status(400).json({
      status: "error",
      errorCode: "MISSING_PARAMETERS",
      message: "transactionId, iban e amount sono obbligatori.",
    });
  }

  // 🔹 Simulazione errori per MVP:
  // - importi ≤1000€: simuliamo pagamento riuscito
  // - importi >1000€ e ≤5000€: simuliamo fondi insufficienti
  // - importi >5000€: simuliamo conto bloccato
  //
  // Queste condizioni sono SOLO per testing locale. Non riflettono logiche reali
  // e dovranno essere sostituite quando collegherai il vero PISP.
  
  if (amount > 1000 && amount <= 5000) {
    return res.status(402).json({
      status: "error",
      errorCode: "INSUFFICIENT_FUNDS",
      message: "Fondi insufficienti sul conto del compratore.",
    });
  }

  if (amount > 5000) {
    return res.status(403).json({
      status: "error",
      errorCode: "ACCOUNT_BLOCKED",
      message: "Conto bloccato per attività sospette.",
    });
  }

  // ➤ Caso di successo simulato
  console.log(`📤 Pagamento simulato accettato dal PISP:
  ➤ ID: ${transactionId}
  ➤ IBAN: ${iban}
  ➤ Importo: €${amount}`);

  return res.status(200).json({
    status: "success",
    message: "Pagamento simulato inviato e accettato dal PISP.",
    transactionId,
    iban,
    amount,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  sendPaymentToPISP,
};
