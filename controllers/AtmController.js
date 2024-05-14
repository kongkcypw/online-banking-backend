const { get_atm_balance_with_atmid } = require("../models/AtmModel");
const { get_atm_join } = require("../models/join/AtmBranchModel");

const get_atm_info = async (req, res) => {
    try {
        const atm_info = await get_atm_join();
        res.status(200).json({ status: 200, message: "get atm info success", atm: atm_info });
    } catch (error) {
        res.status(400).json({ status: 400, message: error });
        console.log(error);
    }
}

const get_atm_balnce = async (req, res) => {
    try {
        const atmID = req.body.atmID
        const atm_balance = await get_atm_balance_with_atmid(atmID);
        res.status(200).json({ status: 200, message: "get atm balance success", balance: atm_balance });
    } catch (error) {
        res.status(400).json({ status: 400, message: error });
        console.log(error);
    }
}

module.exports = {
    get_atm_info,
    get_atm_balnce
}