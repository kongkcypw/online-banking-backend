const { insert_new_reference_topup } = require("../../models/transaction/ReferenceModel");
const { check_transactionID_unique, insert_new_transaction } = require("../../models/transaction/TransactionModel");
const { getTimestamp } = require("../Utils");
const { generateReferenceId } = require("./ReferenceController");

const topup = async (req, res) => {
    try {
        const transactionFlow_first = "IN";
        const transactionFlow_second = "OUT";

        const { transactionType, sourceID, destinationID, amount, description, transactionFee } = req.body;
        console.log(req.body);

        // Generate unique ID
        const transactionID_first = await generateTransactionId(transactionType)
        const transactionID_second = await generateTransactionId(transactionType)
        const referenceID = await generateReferenceId();

        // Insert to Reference
        const insert_reference_result = await insert_new_reference_topup(referenceID, amount);

        // Insert to Transaction
        const insert_first_transaction_result = await insert_new_transaction(transactionID_first, referenceID, destinationID, transactionType, transactionFlow_first, transactionFee, description);
        const insert_second_transaction_result = await insert_new_transaction(transactionID_second, referenceID, sourceID, transactionType, transactionFlow_second, transactionFee, description);
        

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
    let typeCode = '';
    if (type === "topup") {
        typeCode = 'TU';
    }

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
    topup
}