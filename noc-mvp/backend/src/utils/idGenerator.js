// utils/idGenerator.js
const { randomUUID } = require("crypto");

function generateTransactionId() {
  return randomUUID(); // Esempio: 'e8e9d160-7db7-4f7f-a3a5-cc76f0ac6e94'
}

module.exports = generateTransactionId;
