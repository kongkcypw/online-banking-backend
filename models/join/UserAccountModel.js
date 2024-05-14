const { db } = require("../../config/mysql");

const get_account_info_by_accountID = async (userID) => {
    try {
        const query = `SELECT a.UserID, a.AccountID, a.AccountNumber, u.FirstName, u.LastName, u.PhoneNumber, a.Balance, a.CreditcardLimit  FROM Account a `
        + `JOIN User u ON a.UserID = u.UserID AND a.UserID = ?`
        const [rows, fields] = await db.query(query, [userID]);
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}

const get_account_name_by_accountNumber = async (accountNumber, bankID) => {
    try {
        const query = `SELECT u.FirstName, u.LastName FROM Account a `
        + `JOIN User u ON a.UserID = u.UserID AND a.accountNumber = ? AND a.BankID = ?`
        const [rows, fields] = await db.query(query, [accountNumber, bankID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const get_accountID_by_accountNumber = async (accountNumber) => {
    try {
        const query = `SELECT a.AccountID FROM Account a `
        + `JOIN User u ON a.UserID = u.UserID AND a.accountNumber = ?`
        const [rows, fields] = await db.query(query, [accountNumber]);
        return rows[0].AccountID;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_account_info_by_accountID,
    get_account_name_by_accountNumber,
    get_accountID_by_accountNumber
}