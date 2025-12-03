# NoC Payments – Fase 1 (MVP tecnico)

Sistema di pagamento simulato basato su QR code e impronta digitale, con mock di invio verso PISP esterno.

---

##  Endpoint attivi

### 🔹 Generazione QR Code
**GET** `http://localhost:3000/api/payments/generate/:id`  
- `:id` → Transaction ID arbitrario (es. test123)
- Mostra un QR code cliccabile che punta a `/pay/:id`

### 🔹 Simulazione pagamento QR
**GET** `http://localhost:3000/api/payments/pay/:id`  
- Mostra messaggio JSON di conferma
- Simula il click dell’utente dopo aver scannerizzato il QR

> ℹ️ *Nota*: Safari può bloccare i link `http://localhost` cliccati da QR. In tal caso, **copia il link** manualmente o usa **Chrome**.

---

## 🖐️ Simulazione pagamento con impronta (Fase 1.3)

### 🔹 Pagamento diretto via impronta
**POST** `http://localhost:3000/api/payments/fingerprint`  
- Simula pagamento da POS tramite impronta

#### JSON Body richiesto:
```json
{
  "transactionId": "test123"
}

---

### PISP Integration (Mock) (Fase 1.5)

### ➤ Endpoint
POST /api/pisp/send


### ➤ Descrizione
Simula l'invio di un pagamento a un PISP esterno come Fabrick.  
Stampa i dati nel terminale e restituisce una risposta mock di successo.

### ➤ JSON Body richiesto
```json
{
  "transactionId": "test123",
  "iban": "IT60X0542811101000000123456",
  "amount": 49.99
}

➤ Come testarlo con Postman

Avvia il server in terminale:
node src/index.js

Apri Postman e crea una nuova richiesta:
Metodo: POST
URL: http://localhost:3000/api/pisp/send

Vai nella sezione Body:
Seleziona: raw
Tipo: JSON
Incolla il JSON di esempio (vedi sopra)
Invia la richiesta ➜ Dovresti vedere:

✅ Una risposta JSON con status: success
🖥️ Il terminale che stampa i dettagli del pagamento

📌 Nota
Questo endpoint è interamente mockato. Nella Fase 2 verrà integrato con un PISP reale.
---

## 🛠️ Dev info

- BASE_URL definito in `.env`:  
`BASE_URL=http://localhost:3000`

- QR code generato via `qrcode` npm lib (base64 PNG)

---

## 📍 Note utili

- QR code cliccabile = comodo per test locale
- In produzione sarà solo immagine, da scansionare
- Terminale logga le richieste grazie a middleware globale
- Fingerprint e QR rappresentano due alternative parallele
