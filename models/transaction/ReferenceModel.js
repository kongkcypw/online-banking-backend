const { promisePool } = require("../../config/mysql");

const check_referenceID_unique = async (referenceID) => {
    try {
        const query = `SELECT * FROM Reference WHERE ReferenceID = ?`;
        const [rows, fields] = await promisePool.query(query, [referenceID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const insert_new_reference_topup = async (referenceID, amount) => {
    try {
        const query = `INSERT INTO Reference (ReferenceID, Amount, DateTime) VALUES (?, ?, NOW())`;
        const [result] = await promisePool.execute(query, [referenceID, amount]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    check_referenceID_unique,
    insert_new_reference_topup
}