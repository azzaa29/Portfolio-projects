const { generateQRCodeImage } = require("../utils/qrGenerator");
const db = require("../mock-db/db");
const { v4: uuidv4 } = require("uuid");
const { sendPaymentToPISP } = require("../utils/pispSender");
const { zonedTimeToUtc, utcToZonedTime, format } = require("date-fns-tz");

// 1. Crea una nuova transazione
const createTransaction = (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Importo non valido" });
  }

  const transactionId = uuidv4();

  db.saveTransaction(transactionId, {
    amount,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  console.log(`💾 Transazione creata con ID: ${transactionId} – €${amount}`);

  return res.status(201).json({ transactionId });
};

// 2. Mostra la pagina transazione con QR e impronta
const viewTransactionPage = async (req, res) => {
  const transactionId = req.params.id;
  const transactionData = db.getTransactionById(transactionId);

  if (!transactionData) {
    return res.status(404).json({ error: "Transazione non trovata" });
  }

  const paymentURL = `${process.env.BASE_URL}/api/payments/pay/${transactionId}`;

  try {
    const qrImage = await generateQRCodeImage(paymentURL);

    return res.status(200).send(`
      <html>
        <head><title>Pagamento NoC</title></head>
        <body style="font-family: sans-serif; text-align: center; padding-top: 40px;">
          <p>Importo da pagare: <strong>€ ${transactionData.amount.toFixed(2)}</strong></p>
          <p>Scannerizza il QR code oppure paga direttamente con impronta digitale:</p>
          <a href="${paymentURL}">
            <img src="${qrImage}" alt="QR Code" style="width:200px;" />
          </a>
          <br/>
          <form action="/api/payments/fingerprint" method="POST" style="margin-top: 20px;">
            <input type="hidden" name="transactionId" value="${transactionId}" />
            <button type="submit" style="padding: 10px 20px; font-size: 16px;">Paga con impronta digitale</button>
          </form>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("QR code generation error:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

// Funzione interna DRY per processare i pagamenti (QR o impronta)
const processPayment = async (transactionId, res) => {
  if (!transactionId) return res.status(400).json({ error: "Transaction ID mancante" });

  const transactionData = db.getTransactionById(transactionId);
  if (!transactionData) return res.status(404).json({ error: "Transazione non trovata" });

  const createdAt = new Date(transactionData.createdAt);
  const now = new Date();
  const secondsPassed = (now - createdAt) / 1000;

  if (secondsPassed > 90 && transactionData.status === "pending") {
    db.updateTransactionStatus(transactionId, "expired");
    return res.status(410).json({ status: "expired", message: "Transazione scaduta." });
  }

  try {
    const pispResponse = await sendPaymentToPISP(transactionId, "IT00MOCKIBAN1234567890", transactionData.amount);

    if (pispResponse.status === "success") {
      db.updateTransactionStatus(transactionId, "paid");
      console.log(`✅ Transazione ID ${transactionId} marcata come paid dopo conferma PISP`);

      return res.status(200).json({
        message: "Pagamento completato con successo",
        transactionId,
        amount: transactionData.amount,
        status: "paid",
        timestamp: new Date().toISOString(),
      });
    } else {
      db.updateTransactionStatus(transactionId, "failed");
      return res.status(402).json({
        status: "failed",
        message: pispResponse.message || "Il PISP ha rifiutato il pagamento.",
        errorCode: pispResponse.errorCode || "UNKNOWN_ERROR",
      });
    }
  } catch (error) {
    let parsedError;
    try {
      parsedError = JSON.parse(error.message);
    } catch (parseErr) {
      console.error("Errore nel parsing della risposta del PISP:", error.message);
      return res.status(500).json({
        status: "failed",
        message: "Errore imprevisto dal PISP.",
        errorCode: "UNPARSABLE_RESPONSE",
      });
    }
    db.updateTransactionStatus(transactionId, "failed");
    return res.status(500).json({
      status: "failed",
      message: parsedError.message,
      errorCode: parsedError.errorCode,
    });
  }
};

// 3. Simulazione pagamento QR con invio al PISP
const simulatePayment = async (req, res) => {
  const transactionId = req.params.id;
  return processPayment(transactionId, res);
};

// 4. Simulazione pagamento con impronta con invio al PISP
const simulateFingerprintPayment = async (req, res) => {
  const { transactionId } = req.body;
  return processPayment(transactionId, res);
};

// 5. Restituisce le transazioni del giorno selezionato nella dashboard, considerando la timezone locale
const getDailyTransactions = (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: "Parametro 'date' obbligatorio in formato YYYY-MM-DD." });
  }

  const allTransactions = db.getAllTransactions();
  const now = new Date();

  // ➤ Controlla e aggiorna le transazioni scadute
  allTransactions.forEach((tx) => {
    const createdAt = new Date(tx.createdAt);
    const secondsPassed = (now - createdAt) / 1000;
    if (secondsPassed > 90 && tx.status === "pending") {
      db.updateTransactionStatus(tx.id, "expired");
    }
  });

  const filtered = allTransactions.filter((tx) => {
    const txDateUTC = new Date(tx.createdAt);
    const txDateLocal = utcToZonedTime(txDateUTC, "Europe/Rome");
    const txDateLocalStr = format(txDateLocal, "yyyy-MM-dd", { timeZone: "Europe/Rome" });
    return txDateLocalStr === date;
  });

  return res.status(200).json(filtered);
};

module.exports = {
  createTransaction,
  viewTransactionPage,
  simulatePayment,
  simulateFingerprintPayment,
  getDailyTransactions,
};
