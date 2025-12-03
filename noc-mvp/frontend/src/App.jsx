import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import PaymentForm from "./components/PaymentForm";
import Dashboard from "./components/Dashboard";

/* ✅ App.jsx – Router centrale dell'applicazione POS NoC
   Definisce le rotte principali:
   - /          → Menu principale
   - /payment   → Avvia nuovo pagamento
   - /dashboard → Cronologia pagamenti (dashboard venditore)
*/

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ➤ Rotta per il menu principale */}
        <Route path="/" element={<Home />} />

        {/* ➤ Rotta per il form di pagamento */}
        <Route path="/payment" element={<PaymentForm />} />

        {/* ➤ Rotta per la dashboard mock venditore */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
