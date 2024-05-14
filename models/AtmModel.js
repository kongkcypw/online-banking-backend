const { promisePool } = require("../config/mysql");

const get_atm_balance_with_atmid = async (atmID) => {
    try {
        const query = `SELECT Balance FROM ATM WHERE ATMID = ?`;
        const [result] = await promisePool.execute(query, [atmID]);
        return result[0].Balance;
    } catch (error) {
        throw error;
    }
}

const update_atm_balance_with_atmid = async (balance, atmID) => {
    try {
        const query = `UPDATE ATM SET Balance = ? WHERE ATMID = ?`;
        const [result] = await promisePool.execute(query, [balance, atmID]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_atm_balance_with_atmid,
    update_atm_balance_with_atmid
}