// 📦 PaymentForm.jsx – Inserimento importo con formattazione diretta e UX fluida
import { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [rawInput, setRawInput] = useState(""); // 🧮 Input grezzo (es: "1234" = €12,34)

  // 🔢 Gestione input numerico grezzo (max 9 cifre)
  const handleRawInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Solo numeri
    if (value.length > 9) return;
    const cleaned = value.replace(/^0+(?!$)/, ""); // Rimuove zeri iniziali superflui
    setRawInput(cleaned);
  };

  // 💶 Formatta il valore grezzo in stile "€ 12,34"
  const formatAmount = (input) => {
    const padded = input.padStart(3, "0");
    const euros = parseInt(padded.slice(0, -2), 10);
    const cents = padded.slice(-2);
    return `€ ${euros},${cents}`;
  };

  // 💰 Converte il valore in float (es. "1234" => 12.34)
  const getNumericAmount = () => {
    const padded = rawInput.padStart(3, "0");
    const euros = padded.slice(0, -2);
    const cents = padded.slice(-2);
    return parseFloat(`${euros}.${cents}`);
  };

  // 🚀 Submit: crea transazione e reindirizza alla pagina con QR/impronta
  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountValue = getNumericAmount();

    if (amountValue === 0) {
      alert("L'importo non può essere 0,00 €");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/payments/create`,
        { amount: amountValue }
      );

      const { transactionId } = response.data;
      if (transactionId) {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/payments/transaction/${transactionId}`;
      } else {
        console.error("❌ transactionId è undefined");
      }
    } catch (error) {
      console.error("❌ Errore nella creazione della transazione:", error);
    }
  };

  return (
    // ✅ Contenitore esterno per centrare il form a schermo intero
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto p-4 shadow rounded border mt-8 bg-white text-black">
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-semibold">Importo:</label>

          {/* 🧾 Campo input formattato ma modificabile */}
          <input
            type="text"
            inputMode="numeric"
            value={formatAmount(rawInput)} // Mostra "€ 12,34"
            onChange={handleRawInputChange} // Ma salva solo il numero
            className="w-full p-2 border rounded mb-4 text-2xl font-mono text-center"
            placeholder="€ 0,00"
          />

          {/* 🧭 Bottone di submit */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Conferma importo
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
