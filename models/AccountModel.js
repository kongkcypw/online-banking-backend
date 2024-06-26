const { db } = require("../config/mysql");

const check_accountID_exist = async (accountID) => {
    try {
        const query = `SELECT * FROM Account WHERE AccountID = ?`;
        const [rows, fields] = await db.query(query, [accountID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const insert_new_account = async (accountID, userID, bankID, branchID, accountNumber, balance, creditcardLimit) => {
    try {
        const query = `INSERT INTO Account (AccountID, UserID, BankID, BranchID, AccountNumber, Balance, CreditcardLimit, DateOpen) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
        const [result] = await db.execute(query, [accountID, userID, bankID, branchID, accountNumber, balance, creditcardLimit]);
        return result;
    } catch (error) {
        throw error;
    }
}

const get_next_accountID = async (length) => {
    try {
        const query = `SELECT AccountID FROM Account
        WHERE AccountID LIKE 'A%'
        ORDER BY AccountID DESC
        LIMIT 1;`;
        const rows = await db.query(query);  // Execute query without explicit array for parameters
        let newIdNumber;
        if (rows[0].length > 0) {
            const lastId = rows[0][0].AccountID.replace(/\D/g, ''); // Correctly access the first element and get the numeric part
            newIdNumber = parseInt(lastId, 10) + 1; // increment the numeric part
        } else {
            newIdNumber = 1; // If no existing entries, start at 1
        }

        return `A${newIdNumber.toString().padStart(length, '0')}`;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const get_account_balance = async (accountID) => {
    try {
        const query = `SELECT Balance FROM Account WHERE AccountID = ?`;
        const [rows, fields] = await db.query(query, [accountID]);
        if(rows[0]){
            return rows[0].Balance;
        }
        else{
            return null;
        }
    } catch (error) {
        throw error;
    }
}

const update_account_balance = async (connection, balance, accountID) => {
    try {
        if(accountID !== null && balance !== null){
            const query = `UPDATE Account SET Balance = ? WHERE AccountID = ?`;
            const [result] = await connection.execute(query, [balance, accountID]);
            return result;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};
const get_accountID_by_accountNumber_and_userID = async (accountNumber, userID) => {
    try {
        const query = `SELECT AccountID FROM Account WHERE AccountNumber = ? AND UserID = ?`;
        const [rows, fields] = await db.query(query, [accountNumber, userID]);
        return rows[0].AccountID;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    check_accountID_exist,
    insert_new_account,
    get_next_accountID,
    get_account_balance,
    update_account_balance,
    get_accountID_by_accountNumber_and_userID
}