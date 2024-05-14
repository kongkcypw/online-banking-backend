const { db } = require("../config/mysql");

const get_beneficiary_by_accountID = async (accountID) => {
    try {
        const query = `SELECT * FROM Beneficiary WHERE AccountID = ?`;
        const [result] = await db.execute(query, [accountID]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_beneficiary_by_accountID,
}