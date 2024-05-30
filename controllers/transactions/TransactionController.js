const { get_account_balance, update_account_balance, get_accountID_by_accountNumber_and_userID } = require("../../models/AccountModel");
const { insert_new_reference_topup } = require("../../models/transaction/ReferenceModel");
const { check_transactionID_unique, insert_new_transaction } = require("../../models/transaction/TransactionModel");
const { getTimestamp, calculateNewBalance } = require("../Utils");
const { generateReferenceId } = require("./ReferenceController");
const { get_accountID_by_accountNumber } = require("../../models/join/UserAccountModel");
const { get_atm_balance_with_atmid, update_atm_balance_with_atmid } = require("../../models/AtmModel");
const { db } = require("../../config/mysql");

const TransactionFlowCase = [
    { type: "TOPUP", typeCode: "TU", first: "IN", second: "OUT" },
    { type: "BILL", typeCode: "BL", first: "IN", second: "OUT" },
    { type: "TRANSFER", typeCode: "TF", first: "IN", second: "OUT" },
    { type: "WITHDRAW", typeCode: "WD", first: "OUT", second: "OUT" },
    { type: "FILLCASH", typeCode: "FC", first: "IN" }
]

const insert = async (req, res) => {
    const connection = await db.getConnection(); // Get a connection from the pool
    try {
        await connection.beginTransaction(); // Start transaction

        const { transactionType, userID, accountNumber, destID, amount, description, transactionFee } = req.body;
        console.log(req.body);

        // Use userID and accountNumber to get accountID (sourceID)
        const sourceID = await get_accountID_by_accountNumber_and_userID(accountNumber, userID);

        // Match transaction flow for both sides
        const flowCase = TransactionFlowCase.find(transaction => transaction.type === transactionType);
        const transactionFlow_first = flowCase.first;
        const transactionFlow_second = flowCase.second;

        // Transfer: Use accountNumber to get accountID (destinationID)
        let destinationID;
        if (flowCase.type === "TRANSFER") {
            destinationID = await get_accountID_by_accountNumber(destID);
        } else {
            destinationID = destID;
        }

        // Generate unique ID
        const transactionID_first = await generateTransactionId(transactionType);
        const transactionID_second = await generateTransactionId(transactionType);
        const referenceID = await generateReferenceId();

        // Insert to Reference
        const insert_reference_result = await insert_new_reference_topup(connection, referenceID, amount);

        // Insert to Transaction
        const insert_first_transaction_result = await insert_new_transaction(connection, transactionID_first, referenceID, destinationID, transactionType, transactionFlow_first, transactionFee, description);
        const insert_second_transaction_result = await insert_new_transaction(connection, transactionID_second, referenceID, sourceID, transactionType, transactionFlow_second, transactionFee, description);

        // Get Account Balance
        const account_balance_first_transaction = await get_account_balance(destinationID);
        const account_balance_second_transaction = await get_account_balance(sourceID);

        // Calculate new balance
        const newBalance_first = await calculateNewBalance(account_balance_first_transaction, transactionFlow_first, amount);
        const newBalance_second = await calculateNewBalance(account_balance_second_transaction, transactionFlow_second, amount);

        // Update balance
        const updateBalance_first = await update_account_balance(connection, newBalance_first, destinationID);
        const updateBalance_second = await update_account_balance(connection, newBalance_second, sourceID);

        // Debug
        console.log(`account_balance_first_transaction: ${account_balance_first_transaction}`);
        console.log(`account_balance_second_transaction: ${account_balance_second_transaction}`);
        console.log(`newBalance_first: ${newBalance_first}`);
        console.log(`newBalance_second: ${newBalance_second}`);
        console.log(updateBalance_first);
        console.log(updateBalance_second);

        await connection.commit(); // Commit transaction
        res.status(200).json({ status: 200, message: "Transaction success" });
    } catch (error) {
        await connection.rollback(); // Rollback transaction on error
        res.status(400).json({ status: 400, message: error });
        console.log(error);
    } finally {
        connection.release(); // Release connection back to the pool
    }
}

const insert_withdraw = async (req, res) => {
    const connection = await db.getConnection(); // Get a connection from the pool
    try {
        await connection.beginTransaction(); // Start transaction

        const { transactionType, userID, accountNumber, destID, amount, description, transactionFee } = req.body;
        console.log(req.body);

        const destinationID = destID;

        // Use userID and accountNumber to get accountID (sourceID)
        const sourceID = await get_accountID_by_accountNumber_and_userID(accountNumber, userID);
        console.log(sourceID);

        // Match transaction flow for both sides
        const flowCase = TransactionFlowCase.find(transaction => transaction.type === transactionType);
        const transactionFlow_first = flowCase.first;
        const transactionFlow_second = flowCase.second;

        // Generate unique ID
        const transactionID_first = await generateTransactionId(transactionType);
        const transactionID_second = await generateTransactionId(transactionType);
        const referenceID = await generateReferenceId();

        // Insert to Reference
        const insert_reference_result = await insert_new_reference_topup(connection, referenceID, amount);

        // Insert to Transaction
        const insert_first_transaction_result = await insert_new_transaction(connection, transactionID_first, referenceID, destinationID, transactionType, transactionFlow_first, transactionFee, description);
        const insert_second_transaction_result = await insert_new_transaction(connection, transactionID_second, referenceID, sourceID, transactionType, transactionFlow_second, transactionFee, description);

        // Get Account Balance
        const account_balance_first_transaction = await get_atm_balance_with_atmid(destinationID);
        const account_balance_second_transaction = await get_account_balance(sourceID);

        // Calculate new balance
        const newBalance_first = await calculateNewBalance(account_balance_first_transaction, transactionFlow_first, amount);
        const newBalance_second = await calculateNewBalance(account_balance_second_transaction, transactionFlow_second, amount);

        // Update balance
        const updateBalance_first = await update_atm_balance_with_atmid(connection, newBalance_first, destinationID);
        const updateBalance_second = await update_account_balance(connection, newBalance_second, sourceID);

        // Debug
        console.log(`account_balance_first_transaction: ${account_balance_first_transaction}`);
        console.log(`account_balance_second_transaction: ${account_balance_second_transaction}`);
        console.log(`newBalance_first: ${newBalance_first}`);
        console.log(`newBalance_second: ${newBalance_second}`);
        console.log(updateBalance_first);
        console.log(updateBalance_second);

        await connection.commit(); // Commit transaction
        res.status(200).json({ status: 200, message: "Transaction success" });
    } catch (error) {
        await connection.rollback(); // Rollback transaction on error
        res.status(400).json({ status: 400, message: error });
        console.log(error);
    } finally {
        connection.release(); // Release connection back to the pool
    }
};


// Format TTYYMMDDHHMMSSCCCCCC
// TT: Transaction type code (e.g., DP for deposit, WD for withdrawal)
// YYMMDDHHMMSS: Timestamp (Year, Month, Day, Hour, Minute, Second)
// CCCCCC: A unique character
async function generateTransactionId(type) {
    // Define typeCode based on the type of transaction
    const flowCase = TransactionFlowCase.find(transaction => transaction.type === type);
    let typeCode = flowCase.typeCode;

    let unique = false; // Flag to track if the generated ID is unique
    let result = '';   // To store the newly generated transaction ID

    while (!unique) {
        // YYMMDDHHMMSS - Generate timestamp
        let timeStamp = await getTimestamp();

        // CC - Character code generation
        const characterLength = 6;
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseCharacters = characters.toUpperCase();

        // Start building the transaction ID with the type code and timestamp
        result = typeCode + timeStamp;

        // Add random uppercase characters to the transaction ID
        for (let i = 0; i < characterLength; i++) {
            const randomIndex = Math.floor(Math.random() * uppercaseCharacters.length);
            result += uppercaseCharacters[randomIndex];
        }

        // Check if the generated transaction ID is unique
        const repeatID = await check_transactionID_unique(result);
        if (repeatID.length > 0) {
            // If not unique, loop will continue
            unique = false;
        } else {
            // If unique, set flag to true to break the loop
            unique = true;
        }
    }

    // Once unique ID is confirmed, return it
    return result;
}

module.exports = {
    insert,
    insert_withdraw
}