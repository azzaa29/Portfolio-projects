/**
 * ✅ mock-db/db.js – Mock database in memoria
 * 
 * Gestisce le transazioni in un oggetto JS, simula un database persistente.
 */

const transactions = {};

/**
 * Salva una nuova transazione nel mock DB.
 */
function saveTransaction(id, data) {
  transactions[id] = data;
}

/**
 * Recupera una transazione per ID.
 */
function getTransactionById(id) {
  return transactions[id];
}

/**
 * Aggiorna lo stato di una transazione esistente.
 */
function updateTransactionStatus(id, newStatus) {
  if (transactions[id]) {
    transactions[id].status = newStatus;
  }
}

/**
 * Restituisce tutte le transazioni presenti nel mock DB come array.
 */
function getAllTransactions() {
  return Object.entries(transactions).map(([id, data]) => ({
    id,
    ...data,
  }));
}

module.exports = {
  saveTransaction,
  getTransactionById,
  updateTransactionStatus,
  getAllTransactions,
};
