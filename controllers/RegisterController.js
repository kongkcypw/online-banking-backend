require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check_user_exist,
    insert_new_user,
    select_user_by_email,
    update_user_set_pin
} = require("../models/UserModel");


const register_password = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber } = req.body;

        // Validate user input
        if (!(firstName && lastName && email && password && phoneNumber)) {
            res.status(400).send("All input is required");
        }

        // Validate if user exist in our database
        const check_exist = await check_user_exist(email);
        const oldUser = check_exist.length > 0;
        if (oldUser) {
            console.log(oldUser);
            return res.status(409).send("User already exist. Please Login");
        }

        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10)

        // generate UserID
        const userID = await generateUserId(16);

        // Insert new user in database
        const insert_result = await insert_new_user(userID, email.toLowerCase(), encryptedPassword, firstName, lastName, phoneNumber)
        const user = await select_user_by_email(email);

        const localStorage = user.Email;

        // return new user
        res.status(201).json(localStorage);

    } catch (error) {
        console.log(error);
    }
}

const register_pin = async (req, res) => {
    try {
        const { email, pin } = req.body;

        // Validate data in local Storage(email) and user input(pin)
        if (!(email)) {
            res.status(400).send("Please login");
        }

        if (!(pin)) {
            res.status(400).send("Please Input pin");
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

            return res.status(200).json(user);
        }

        res.status(400).send("Please login");

    } catch (error) {
        console.log(error);
    }
}

async function generateUserId(length) {
    // Define the characters that can be used in the ID
    const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = 'u'; // Start with 'u'
    // Generate random characters from the defined character set
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

module.exports = {
    register_password,
    register_pin
}