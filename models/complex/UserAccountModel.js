const { promisePool } = require("../../config/mysql");

const get_account_info_by_accountID = async (userID) => {
    try {
        const query = `SELECT u.FirstName, u.LastName, a.AccountNumber, a.Balance, a.CreditcardLimit  FROM Account a `
        + `JOIN User u ON a.UserID = u.UserID AND a.UserID = ?`
        const [rows, fields] = await promisePool.query(query, [userID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_account_info_by_accountID,
}