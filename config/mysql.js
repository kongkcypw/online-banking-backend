require('dotenv').config();

const mysql = require('mysql2');

const sql_connection_config = {
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
}

const pool = mysql.createPool(sql_connection_config);

// For pool to use promises
const promisePool = pool.promise();

// Export for controller
module.exports = { promisePool };