const { promisePool } = require("../config/mysql");

const get_all_branch = async () => {
    try {
        const query = `SELECT * FROM Branch`;
        const [rows, fields] = await promisePool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_all_branch
}