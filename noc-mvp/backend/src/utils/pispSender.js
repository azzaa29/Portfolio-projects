const axios = require("axios");

/**
 * Simula l'invio di un pagamento a un PISP esterno
 * @param {string} transactionId - ID transazione
 * @param {string} iban - IBAN destinatario mock
 * @param {number} amount - Importo
 * @returns {Promise<object>} risposta JSON dal PISP
 */
async function sendPaymentToPISP(transactionId, iban, amount) {
  try {
    const response = await axios.post(`${process.env.BASE_URL}/api/pisp/send`, {
      transactionId,
      iban,
      amount,
    });

    console.log(`✅ PISP ha risposto per ID: ${transactionId}
    ➤ Status: ${response.status}
    ➤ Messaggio: ${response.data.message || "N/A"}`);

    return response.data;
  } catch (error) {
    if (error.response) {
      // Errore restituito dal PISP con codice e messaggio
      console.error(`❌ Errore dal PISP per ID: ${transactionId}:`, error.response.data);
      throw new Error(JSON.stringify(error.response.data)); // passo l'errore dettagliato
    } else {
      // Errore di connessione / tecnico
      console.error(`❌ Errore di connessione al PISP per ID: ${transactionId}:`, error.message);
      throw new Error(JSON.stringify({
        errorCode: "PISP_CONNECTION_ERROR",
        message: "Impossibile connettersi al server PISP. Riprovare.",
      }));
    }
  }
}

module.exports = { sendPaymentToPISP };
