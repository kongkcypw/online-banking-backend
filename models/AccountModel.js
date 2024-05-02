const { promisePool } = require("../config/mysql");

const check_accountID_exist = async (accountID) => {
    try {
        const query = `SELECT * FROM Account WHERE AccountID = ?`;
        const [rows, fields] = await promisePool.query(query, [accountID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const insert_new_account = async (accountID, userID, accountNumber, branchID, balance, creditcardLimit) => {
    try {
        const query = `INSERT INTO Account (AccountID, UserID, AccountNumber, BranchID, Balance, CreditcardLimit) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await promisePool.execute(query, [accountID, userID, accountNumber, branchID, balance, creditcardLimit]);
        return result;
    } catch (error) {
        throw error;
    }
}

const get_next_accountID = async (length) => {
    try {
        const query = `SELECT AccountID FROM Account
        WHERE AccountID LIKE 'A%'
        ORDER BY AccountID DESC
        LIMIT 1;`;
        const rows = await promisePool.query(query);  // Execute query without explicit array for parameters
        let newIdNumber;
        if (rows[0].length > 0) {
            const lastId = rows[0][0].AccountID.replace(/\D/g, ''); // Correctly access the first element and get the numeric part
            newIdNumber = parseInt(lastId, 10) + 1; // increment the numeric part
        } else {
            newIdNumber = 1; // If no existing entries, start at 1
        }

        return `A${newIdNumber.toString().padStart(length, '0')}`;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = {
    check_accountID_exist,
    insert_new_account,
    get_next_accountID
}