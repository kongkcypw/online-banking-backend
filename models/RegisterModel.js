const { promisePool } = require("../config/mysql");

const get_all_row_test_connection = async () => {
    try {
        const [rows, fields] = await promisePool.query("SELECT * FROM test_connection");
        return rows;
    } catch (error) {
        throw error;  
    }
}

module.exports = {
    get_all_row_test_connection
}