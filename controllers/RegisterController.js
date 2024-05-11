require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check_user_exist,
    insert_new_user,
    select_user_by_email,
    update_user_set_pin,
    get_next_userID
} = require("../models/UserModel");
const { check_accountID_exist,
    insert_new_account,
    get_next_accountID,
    get_accountInfo_by_userID
} = require("../models/AccountModel");
const { get_all_branch } = require("../models/BranchModel");
const { generateBankAccountNumber,
    findClosestBranch,
    extractNumber
} = require('./AccountController');
const { calculateAge } = require('./Utils');


const register_password = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phoneNumber } = req.body;

        // Validate user input
        if (!(firstname && lastname && email && password && phoneNumber)) {
            return res.status(201).json({ status: 201, message: "All input is required" });
        }

        // Validate if user exist in our database
        const check_exist = await check_user_exist(email);
        const oldUser = check_exist.length > 0;
        if (oldUser) {
            return res.status(202).json({ status: 202, message: "User already exist, please login" });
        }

        // Encrypt user password
        // encryptedPassword = await bcrypt.hash(password, 10)

        // generate UserID
        // const userID = await get_next_userID(4);

        // Insert new user in database
        // const insert_result = await insert_new_user(userID, email.toLowerCase(), encryptedPassword, firstname, lastname, phoneNumber)
        // const user = await select_user_by_email(email);

        // return new user
        // return res.status(200).json({ status: 200, message: "Register Success", email: user.Email, userID: user.UserID });

        return res.status(200).json({ status: 200, message: "Validate input success" });

    } catch (error) {
        console.log(error);
    }
}

const register_account = async (req, res) => {
    try {
        const { idCard, birth, address, balance, latitude, longitude } = req.body;
        console.log(req.body);

        // Validate Input
        if (!(idCard && birth && address && balance && latitude && longitude)) {
            return res.status(201).json({ status: 201, message: "All input is required" });
        }
        // Validate Age
        if (birth) {
            const age = await calculateAge(birth);
            if (age < 12) {
                return res.status(202).json({ status: 202, message: "Your age under 12 years old" });
            }
        }

        // Get all branch data
        const all_branch = await get_all_branch();
        // User location
        const userLocation = {
            latitude: latitude,
            longitude: longitude
        }
        // Find closet branch for user
        const closestBranchID = await findClosestBranch(userLocation, all_branch);
        console.log(closestBranchID);

        const branchNumber = await extractNumber(closestBranchID);
        console.log(branchNumber);

        const branch = {
            closestBranchID: closestBranchID,
            branchNumber: branchNumber
        }

        // const accountNumber = await generateBankAccountNumber(branchNumber);
        // console.log(accountNumber);

        // const accountID = await get_next_accountID(4);
        // console.log(accountID);

        // const result = await insert_new_account(accountID, userID, accountNumber, closestBranchID, balance, creditCardLimit_init);
        // console.log(result);


        res.status(200).json({ status: 200, message: "Validate input success", branch: branch });
    } catch (error) {
        console.log(error);
    }
}

const register_confirm = async (req, res) => {
    const creditCardLimit_init = 20000;
    try {
        // Table User
        const { email, password, firstname, lastname, idCard, phoneNumber, address, birth } = req.body.user;
        //  Table Account
        const { branchNumber, branchID, balance, bankID } = req.body.account;

        // -------------------------------- User
        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10)
        // Generate UserID
        const userID = await get_next_userID(4);
        // Insert new user in database
        const insert_user_result = await insert_new_user(userID, email.toLowerCase(), encryptedPassword, firstname, lastname, idCard, phoneNumber, address, birth)
        console.log(insert_user_result);
        const user = await select_user_by_email(email);

        // -------------------------------- Account
        // Generate AccountID
        const accountID = await get_next_accountID(4);
        // Generate AccountNumber
        const accountNumber = await generateBankAccountNumber(branchNumber);
        console.log(accountID);
        // Insert new account in database
        const insert_account_result = await insert_new_account(accountID, userID, bankID, accountNumber, branchID, parseFloat(balance), creditCardLimit_init);
        console.log(insert_account_result);

        // return new user
        return res.status(200).json({ status: 200, message: "Register Success", email: user.Email, userID: user.UserID });
    } catch (error) {
        console.log(error)
        return res.status(202).json({ status: 202, message: "Register Fail", errorMessage: error });
    }

}

const register_pin = async (req, res) => {
    try {
        const { email, pin } = req.body;

        // Validate data in local Storage(email) and user input(pin)
        if (!(email)) {
            return res.status(201).json({ status: 201, message: "Please login" });
        }
        if (!(pin)) {
            return res.status(202).json({ status: 202, message: "Please Input pin" });
        }

        // Encypted Pin
        encryptedPin = await bcrypt.hash(pin, 10)

        // Validate if user exist in our database
        const check_exist = await check_user_exist(email);
        const user_exist = check_exist.length > 0;

        // Get user data
        const user = await select_user_by_email(email);

        if (user_exist) {
            // Set pin in database
            const setPin = await update_user_set_pin(email, encryptedPin);

            // Create token
            const token = jwt.sign(
                { user_id: user.UserID, email },
                process.env.JWT_TOKEN_KEY,
                {
                    expiresIn: process.env.JWT_TOKEN_EXPIRE
                }
            )

            // save user token
            user.token = token;

            return res.status(200).json({ status: 200, message: "Register Pin success", user: user });
        }

        return res.status(203).json({ status: 203, message: "Please register" });

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    register_password,
    register_account,
    register_pin,
    register_confirm
}