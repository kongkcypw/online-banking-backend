const { promisePool } = require("../config/mysql");

const get_all_bill = async () => {
    try {
        const query = `SELECT * FROM Bill`;
        const [result] = await promisePool.execute(query);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_all_bill
}