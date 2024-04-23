const RegisterModel = require("../models/RegisterModel")

const register_get = async (req, res) => {
    try {
        const test_connection = await RegisterModel.get_all_row_test_connection();
        res.json(test_connection);
    } catch (error) {
        console.error('Error in test_connection', error);
        res.status(500).send(`Error in server!: Message: ${error.message}`);
    }
}

const register_post = (req, res) => {
    res.send("Register POST");
}

module.exports = {
    register_get,
    register_post
}