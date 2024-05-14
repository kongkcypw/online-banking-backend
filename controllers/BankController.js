const { get_all_bank } = require("../models/BankModel");

const get_all = async (req, res) => {
    try{
        const bank_data = await get_all_bank();
        res.status(200).json({ status: 200, message: "get bank data success", bank: bank_data });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get_all
}