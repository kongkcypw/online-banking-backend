require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check_user_exist, select_user_by_email } = require("../models/UserModel");

const login_password = async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        // Validate if user exist in our database
        const check_exist = await check_user_exist(email);
        const user_exist = check_exist.length > 0;

        // Get user data
        const user = await select_user_by_email(email);


        if (user_exist && (await bcrypt.compare(password, user.Password))) {

            const localStorage = user.Email;

            return res.status(200).json(localStorage);
        }

        res.status(400).send("Invalid Credentials");


    } catch (error) {
        console.log(error);
    }
}

const login_pin = async (req, res) => {
    try {
        const { email, pin } = req.body;

        // Validate data in local Storage(email) and user input(pin)
        if (!(email)) {
            res.status(400).send("Please login");
        }

        if (!(pin)) {
            res.status(400).send("Please Input pin");
        }

        // Validate if user exist in our database
        const check_exist = await check_user_exist(email);
        const user_exist = check_exist.length > 0;

        // Get user data
        const user = await select_user_by_email(email);

        console.log(user);

        console.log(pin)

        if (user_exist && (await bcrypt.compare(pin, user.Pin))) {

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

        res.status(400).send("Invalid Credentials");


    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    login_password,
    login_pin
}
