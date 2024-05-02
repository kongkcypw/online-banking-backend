const { get_account_balance, update_account_balance } = require("../../models/AccountModel");
const { insert_new_reference_topup } = require("../../models/transaction/ReferenceModel");
const { check_transactionID_unique, insert_new_transaction } = require("../../models/transaction/TransactionModel");
const { getTimestamp, calculateNewBalance } = require("../Utils");
const { generateReferenceId } = require("./ReferenceController");

const TransactionFlowCase = [
    { type: "TOPUP", typeCode: "TU", first: "IN", second: "OUT"},
    { type: "BILL", typeCode: "BL", first: "IN", second: "OUT" },
    { type: "TRANSFER", typeCode: "TF", first: "IN", second: "OUT"},
    { type: "WITHDRAW", typeCode: "WD", first: "OUT", second: "OUT"}
]

const insert = async (req, res) => {
    try {
        const { transactionType, sourceID, destinationID, amount, description, transactionFee } = req.body;
        console.log(req.body);

        // Match transaction flow for both sides
        const flowCase = TransactionFlowCase.find(transaction => transaction.type === transactionType);
        const transactionFlow_first = flowCase.first;
        const transactionFlow_second = flowCase.second;

        // Generate unique ID
        const transactionID_first = await generateTransactionId(transactionType)
        const transactionID_second = await generateTransactionId(transactionType)
        const referenceID = await generateReferenceId();

        // Insert to Reference
        const insert_reference_result = await insert_new_reference_topup(referenceID, amount);

        // Insert to Transaction
        const insert_first_transaction_result = await insert_new_transaction(transactionID_first, referenceID, destinationID, transactionType, transactionFlow_first, transactionFee, description);
        const insert_second_transaction_result = await insert_new_transaction(transactionID_second, referenceID, sourceID, transactionType, transactionFlow_second, transactionFee, description);

        // Get Account Balance
        const account_balance_first_transaction = await get_account_balance(destinationID);
        const account_balance_second_transaction = await get_account_balance(sourceID);
        
        // Calculate new balance
        const newBalance_first = await calculateNewBalance(account_balance_first_transaction, transactionFlow_first, amount);
        const newBalance_second = await calculateNewBalance(account_balance_second_transaction, transactionFlow_second, amount);

        // Update balance
        const updateBalance_first = await update_account_balance(newBalance_first, destinationID);
        const updateBalance_second = await update_account_balance(newBalance_second, sourceID);

        // Debug
        console.log(`account_balance_first_transaction: ${account_balance_first_transaction}`);
        console.log(`account_balance_second_transaction: ${account_balance_second_transaction}`);
        console.log(`newBalance_first: ${newBalance_first}`);
        console.log(`newBalance_second: ${newBalance_second}`);
        console.log(updateBalance_first)
        console.log(updateBalance_second);

        res.status(200).json({ status: 200, message: "Topup transaction sucess" });
    } catch (error) {
        console.log(error);
    }
}

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
    insert
}