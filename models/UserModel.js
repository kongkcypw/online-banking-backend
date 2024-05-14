const { db } = require("../config/mysql");

const check_user_exist = async (email) => {
    try {
        const query = `SELECT * FROM User WHERE Email = ?`;
        const [rows, fields] = await db.query(query, [email]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const insert_new_user = async (userID, email, password, firstName, lastName, idCard, phoneNumber, address, birth) => {
    try {
        const query = `INSERT INTO User (UserID, Email, Password, FirstName, LastName, IdCard, PhoneNumber, Address, Birth) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(query, [userID, email, password, firstName, lastName, idCard, phoneNumber, address, birth]);
        return result;
    } catch (error) {
        throw error;
    }
}

const select_user_by_email = async (email) => {
    try {
        const query = `SELECT * FROM User WHERE Email = ?`;
        const [rows, fields] = await db.query(query, [email])
        return rows[0];
    } catch (error) {
        throw error;
    }
}

const update_user_set_pin = async (email, pin) => {
    try {
        const query = `UPDATE User SET Pin = ? WHERE Email = ?`;
        const [result] = await db.query(query, [pin, email])
        return result;
    } catch (error) {
        throw error;
    }
}

const get_next_userID = async (length) => {
    try {
        const query = `SELECT UserID FROM User
        WHERE UserID LIKE 'U%'
        ORDER BY UserID DESC
        LIMIT 1;`;
        const rows = await db.query(query);  // Execute query without explicit array for parameters
        let newIdNumber;
        if (rows[0].length > 0) {
            const lastId = rows[0][0].UserID.replace(/\D/g, ''); // Correctly access the first element and get the numeric part
            newIdNumber = parseInt(lastId, 10) + 1; // increment the numeric part
        } else {
            newIdNumber = 1; // If no existing entries, start at 1
        }

        return `U${newIdNumber.toString().padStart(length, '0')}`;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    check_user_exist,
    insert_new_user,
    select_user_by_email,
    update_user_set_pin,
    get_next_userID
}