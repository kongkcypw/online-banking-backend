const { promisePool } = require("../config/mysql");

const check_user_exist = async (email) => {
    try {
        const query = `SELECT * FROM User WHERE Email = ?`;
        const [rows, fields] = await promisePool.query(query, [email]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const insert_new_user = async (userID, email, password, firstName, lastName, phoneNumber) => {
    try {
        const query = `INSERT INTO User (UserID, Email, Password, FirstName, LastName, PhoneNumber) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await promisePool.execute(query, [userID, email, password, firstName, lastName, phoneNumber]);
        return result;
    } catch (error) {
        throw error;
    }
}

const select_user_by_email = async (email) => {
    try {
        const query = `SELECT * FROM User WHERE Email = ?`;
        const [rows, fields] = await promisePool.query(query, [email])
        return rows[0];
    } catch (error) {
        throw error;
    }
}

const update_user_set_pin = async (email, pin) => {
    try {
        const query = `UPDATE User SET Pin = ? WHERE Email = ?`;
        const [result] = await promisePool.query(query, [pin, email])
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    check_user_exist,
    insert_new_user,
    select_user_by_email,
    update_user_set_pin
}