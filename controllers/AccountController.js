const { check_accountID_exist, insert_new_account, get_next_accountID } = require("../models/AccountModel");
const { get_all_branch } = require("../models/BranchModel");

const creditCardLimit_init = 20000;

const create_new_account = async (req, res) => {
    try {
        const { userID, latitude, longitude, balance } = req.body;
        console.log(req.body);

        const all_branch = await get_all_branch();

        const userLocation = {
            latitude: latitude,
            longitude: longitude
        }
        const closestBranchID = await findClosestBranch(userLocation, all_branch);
        console.log(closestBranchID);

        const branchNumber = await extractNumber(closestBranchID);
        console.log(branchNumber);

        const accountNumber = await generateBankAccountNumber(branchNumber);
        console.log(accountNumber);

        const accountID = await get_next_accountID(4);
        console.log(accountID);

        const result = await insert_new_account(accountID, userID, accountNumber, closestBranchID, balance, creditCardLimit_init);
        console.log(result);

        res.status(200).json({ status: 200, message: "create new account success" });
    } catch (error) {
        console.log(error);
    }
}

async function generateBankAccountNumber(branchNumber) {

    let unique = false; // Flag to track if the generated ID is unique
    let firstDigit, remainingDigits, result;

    while (!unique) {
        result = "";
        // Generate the first digit between 1 and 9
        // firstDigit = Math.floor(Math.random() * 9) + 1;
        firstDigit = branchNumber;

        // Generate the remaining 9 digits, which can be between 0 and 9
        remainingDigits = "";
        for (let i = 0; i < 6; i++) {
            remainingDigits += Math.floor(Math.random() * 10);
        }
        result = firstDigit + remainingDigits

        // Check if the generated transaction ID is unique
        const repeatID = await check_accountID_exist(result);
        if (repeatID.length > 0) {
            // If not unique, loop will continue
            unique = false;
        } else {
            // If unique, set flag to true to break the loop
            unique = true;
        }
    }
    // Combine the first digit with the remaining nine digits
    return result;
}

async function findClosestBranch(userLocation, branches) {
    let minDistance = Infinity;
    let closestBranchID = null;

    for (let branch of branches) {
        let distance = await getDistanceFromLatLonInKm(
            userLocation.latitude,
            userLocation.longitude,
            parseFloat(branch.Latitude),
            parseFloat(branch.Longitude)
        );
        if (distance < minDistance) {
            minDistance = distance;
            closestBranchID = branch.BranchID;
        }
    }
    return closestBranchID;
}

async function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

async function extractNumber(inputString) {
    // This regular expression replaces any non-digit characters with an empty string
    const numbers = inputString.replace(/\D/g, '');
    return numbers;
}

module.exports = {
    create_new_account
}