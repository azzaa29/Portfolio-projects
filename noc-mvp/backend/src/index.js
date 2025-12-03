/// index.js

// Import di base
const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// Caricamento variabili d'ambiente da .env
dotenv.config();

// Inizializzazione app Express
const app = express();

// Middleware per abilitare CORS (Cross-Origin Resource Sharing)
// Origin configurabile via env
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
}));

// Middleware di sicurezza HTTP (protezione header, XSS, ecc.)
app.use(helmet());

// Aggiunta Content Security Policy di base per evitare XSS
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", "data:"], // consenti QR in base64
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"], // inline ok per MVP, valuta di toglierlo in futuro
  },
}));

// Rate limiting: massimo 100 richieste/minuto per IP
app.use(rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Middleware per parsing JSON nelle richieste
app.use(express.json());

// Logging semplice di tutte le richieste (utile solo in fase di sviluppo)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rotte per gestione pagamenti
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);

// Rotte per simulazione invio a PISP mock
const pispRoutes = require("./routes/pispRoutes");
app.use("/api/pisp", pispRoutes);

// Fallback per rotte non trovate
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

// Middleware globale per gestione errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: "Internal Server Error",
  });
});

// Avvio del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
