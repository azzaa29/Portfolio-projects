# NoC – Instant Payment MVP

NoC is a technical MVP of an instant-payment system designed to offer a
low-cost alternative to traditional card payments.  
This version runs entirely in local environment and simulates the complete
payment flow (QR code + fingerprint) using a mock PISP.

## 🔹 Tech Stack
**Backend**
- Node.js + Express  
- Modular controllers, routes and utilities  
- In-memory mock database  
- Helmet, rate limiting, CORS, global error handling  

**Frontend**
- React + Vite  
- TailwindCSS  
- Pages for payment creation, payment UI (QR + fingerprint) and dashboard view  

## 🔹 Features
- Create a payment transaction with unique ID  
- Display a payment page with QR code and optional fingerprint flow  
- Simulated payment confirmation via mock PISP  
- Daily dashboard of transactions (timezone: Europe/Rome)  
- Basic security middleware included (Helmet, rate limiting, CORS)  

## 🔹 Project Structure
noc-mvp/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── utils/
│   ├── mock-db/
│   └── index.js
└── frontend/
└── src/
├── Home.jsx
├── PaymentForm.jsx
├── Dashboard.jsx
└── main.jsx

## 🔹 Notes
- Payments are simulated using a mock PISP.  
- Data is stored in an in-memory database and resets on every restart.  
