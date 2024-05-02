require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check_user_exist,
    insert_new_user,
    select_user_by_email,
    update_user_set_pin,
    get_next_userID
} = require("../models/UserModel");


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
        encryptedPassword = await bcrypt.hash(password, 10)

        // generate UserID
        const userID = await get_next_userID(4);

        // Insert new user in database
        const insert_result = await insert_new_user(userID, email.toLowerCase(), encryptedPassword, firstname, lastname, phoneNumber)
        const user = await select_user_by_email(email);

        const localStorage = user.Email;

        // return new user
        return res.status(200).json({ status: 200, message: "Register Success", email: user.Email});

    } catch (error) {
        console.log(error);
    }
}

const register_pin = async (req, res) => {
    try {
        const { email, pin } = req.body;

        // Validate data in local Storage(email) and user input(pin)
        if (!(email)) {
            return res.status(201).json({ status: 201, message: "Please login"});
        }
        if (!(pin)) {
            return res.status(202).json({ status: 202, message: "Please Input pin"});
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

            return res.status(200).json({ status: 200, message: "Register Pin success", user:user});
        }

        return res.status(203).json({ status: 203, message: "Please register"});

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    register_password,
    register_pin
}