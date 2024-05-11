const { promisePool } = require("../config/mysql");

const get_all_topup = async () => {
    try {
        const query = `SELECT * FROM Topup`;
        const [result] = await promisePool.execute(query);
        return result;
    } catch (error) {
        throw error;
    }
}

const get_topup_by_topupID = async (topupID) => {
    try {
        const query = `SELECT * FROM Topup WHERE TopupID = ?`;
        const [result] = await promisePool.execute(query, [topupID]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_all_topup,
    get_topup_by_topupID
}