import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { utcToZonedTime, format } from "date-fns-tz";

/**
 * ✅ Dashboard.jsx – Pagina di cronologia pagamenti giornaliera
 * 
 * Funzionalità:
 * - Mostra le transazioni del giorno selezionato in una tabella chiara e proporzionata.
 * - Permette la navigazione tra giorni precedenti e successivi (fino alla data odierna).
 * - Calcola e visualizza il totale degli incassi del giorno.
 * - Converte i timestamp in orario locale per una migliore leggibilità.
 * - Include un link per tornare al menu principale.
 */

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  /**
   * Carica le transazioni dal backend per la data attualmente selezionata.
   * Calcola il totale degli incassi delle transazioni con stato "paid".
   */
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Converte currentDate nella timezone Europe/Rome e formatta come YYYY-MM-DD
        const dateStr = format(utcToZonedTime(currentDate, "Europe/Rome"), "yyyy-MM-dd");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/payments/dashboard?date=${dateStr}`
        );
        const data = response.data || [];
        setTransactions(data);

        const totalPaid = data
          .filter((tx) => tx.status === "paid")
          .reduce((sum, tx) => sum + tx.amount, 0);
        setTotal(totalPaid);
      } catch (error) {
        console.error("❌ Errore nel recupero delle transazioni:", error);
      }
    };

    fetchTransactions();
  }, [currentDate]);

  /**
   * Naviga al giorno precedente rispetto alla data corrente.
   */
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  /**
   * Naviga al giorno successivo rispetto alla data corrente,
   * limitato alla data odierna per evitare di andare oltre oggi.
   */
  const goToNextDay = () => {
    const today = utcToZonedTime(new Date(), "Europe/Rome");
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
  
    const todayStr = format(today, "yyyy-MM-dd");
    const nextDateStr = format(utcToZonedTime(nextDate, "Europe/Rome"), "yyyy-MM-dd");
  
    if (nextDateStr <= todayStr) {
      setCurrentDate(nextDate);
    }
  };

  /**
   * Determina se la data corrente coincide con la data odierna.
   * Utilizzato per abilitare/disabilitare il pulsante "Giorno successivo".
   */
  const isToday = () => {
    const today = utcToZonedTime(new Date(), "Europe/Rome");
    const currentDateLocal = utcToZonedTime(currentDate, "Europe/Rome");
    return format(today, "yyyy-MM-dd") === format(currentDateLocal, "yyyy-MM-dd");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-8 text-white relative">
      {/* Titolo con data corrente formattata */}
      <h1 className="text-4xl font-semibold mb-8 text-center">
        Cronologia pagamenti del{" "}
        {currentDate.toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </h1>

      {/* Sezione pulsanti per la navigazione tra i giorni */}
      <div className="flex space-x-6 mb-10">
        <button
          onClick={goToPreviousDay}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Giorno precedente
        </button>
        {!isToday() && (
          <button
            onClick={goToNextDay}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
          >
            Giorno successivo
          </button>
        )}
      </div>

      {/* Visualizzazione del totale incasso */}
      <div className="text-2xl font-bold mb-10 text-center">
        Totale incasso tramite POS: € {total.toFixed(2)}
      </div>

      {/* Tabella delle transazioni con proporzioni adeguate */}
      <div className="w-full max-w-4xl overflow-x-auto mb-16">
        <table className="w-full bg-gray-800 rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left w-1/4">ID Transazione</th>
              <th className="px-4 py-2 border-b text-left w-1/6">Importo (€)</th>
              <th className="px-4 py-2 border-b text-left w-1/6">Stato</th>
              <th className="px-4 py-2 border-b text-left w-1/3">Orario</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-4 py-2 border-b break-all">{tx.id}</td>
                <td className="px-4 py-2 border-b">€ {tx.amount.toFixed(2)}</td>
                <td className="px-4 py-2 border-b capitalize">{tx.status}</td>
                <td className="px-4 py-2 border-b">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Link per tornare al menu principale */}
      <div className="mb-8">
        <Link to="/" className="text-blue-400 underline">
          Torna al menu principale
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
