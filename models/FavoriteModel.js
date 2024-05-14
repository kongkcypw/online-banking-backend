const { db } = require("../config/mysql");

const get_favorite_by_accountID = async (accountID) => {
    try {
        const query = `SELECT a.AccountNumber, f.BankID, f.Name, b.Logo FROM Favorite f
                       JOIN Bank b ON f.BankID = b.BankID AND OwnerAccountID = ?
                       JOIN Account a ON f.DestinationAccountID = a.AccountID`;
        const [result] = await db.execute(query, [accountID]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_favorite_by_accountID,
}