const { promisePool } = require("../../config/mysql");

const get_next_transactionID = async (length, transactionType) => {
    try {
        const query = `SELECT TransactionID FROM Transaction
        WHERE TransactionID LIKE ?
        ORDER BY TransactionID DESC
        LIMIT 1;`;
        const values = [`${transactionType}-%`];
        const rows = await promisePool.query(query, [values]);
        let newIdNumber;
        if (rows[0].length > 0) {
          const lastId = rows[0].TransactionID.split('-')[1]; // split to get the numeric part
          newIdNumber = parseInt(lastId, 10) + 1; // increment the numeric part
        } else {
          newIdNumber = 1; // If no existing entries, start at 1
        }
        return `${transactionType}-${newIdNumber.toString().padStart(length, '0')}`;;
    } catch (error) {
        throw error;
    }
}

const check_transactionID_unique = async (transactionID) => {
  try {
    const query = `SELECT * FROM Transaction WHERE TransactionID = ?`;
    const [rows, fields] = await promisePool.query(query, [transactionID]);
    return rows;
  } catch (error) {
    throw error;
  }
}

const insert_new_transaction = async (transactionID, referenceID, destinationID, transactionType, transactionFlow, transactionFee, description) => {
  try {
      const query = `INSERT INTO Transaction (TransactionID, ReferenceID, DestinationID, TransactionType, TransactionFlow, TransactionFee, Description) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await promisePool.execute(query, [transactionID, referenceID, destinationID, transactionType, transactionFlow, transactionFee, description]);
      return result;
  } catch (error) {
      throw error;
  }
}

module.exports = {
    check_transactionID_unique,
    insert_new_transaction,
}