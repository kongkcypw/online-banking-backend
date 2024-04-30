const { check_referenceID_unique } = require("../../models/transaction/ReferenceModel");
const { getTimestamp } = require("../Utils");

// Format YYMMDDHHMMSSCCCNNNNN
// YYMMDDHHMMSS: Timestamp (Year, Month, Day, Hour, Minute, Second)
// CCC: Random unique character
// NNNNN: Random unique number
async function generateReferenceId() {

    let unique = false; // Flag to track if the generated ID is unique
    let result = '';   // To store the newly generated transaction ID

    while (!unique) {
        // YYMMDDHHMMSS - Generate timestamp
        let timeStamp = await getTimestamp();

        // CC - Character code generation
        const characterLength = 3;
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseCharacters = characters.toUpperCase();

        // Start building the transaction ID with the type code and timestamp
        result = timeStamp;

        // Add random uppercase characters to the transaction ID
        for (let i = 0; i < characterLength; i++) {
            const randomIndex = Math.floor(Math.random() * uppercaseCharacters.length);
            result += uppercaseCharacters[randomIndex];
        }

        const numberLength = 5;
        const number = '0123456789';

        // Add random number to the transaction ID
        for (let i = 0; i < numberLength; i++) {
            const randomIndex = Math.floor(Math.random() * number.length);
            result += number[randomIndex];
        }

        // Check if the generated transaction ID is unique
        const repeatID = await check_referenceID_unique(result);
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
    generateReferenceId
}