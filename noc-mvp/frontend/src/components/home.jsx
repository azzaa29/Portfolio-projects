import { Link } from "react-router-dom";

/* ✅ Home.jsx – Pagina principale del POS
   Mostra il menu con le opzioni principali per l'operatore:
   - Avvia pagamento
   - Cronologia pagamenti (dashboard)
   In futuro potrai aggiungere rimborsi, report, ecc.
*/

const Home = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
    <h1 className="text-4xl font-semibold mb-8">POS NoC – Menu Principale</h1>

    <div className="space-y-4 w-full max-w-xs">
      {/* ➤ Pulsante per avviare un nuovo pagamento */}
      <Link
        to="/payment"
        className="bg-green-600 px-6 py-3 rounded text-xl hover:bg-green-700 block text-center"
      >
        Avvia Pagamento
      </Link>

      {/* ➤ Pulsante per accedere alla cronologia pagamenti */}
      <Link
        to="/dashboard"
        className="bg-blue-600 px-6 py-3 rounded text-xl hover:bg-blue-700 block text-center"
      >
        Cronologia Pagamenti
      </Link>

      {/* 🚧 Qui potrai aggiungere altre opzioni come Rimborsi, Report, ecc. */}
    </div>
  </div>
);

export default Home;
