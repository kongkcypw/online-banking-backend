const { get_beneficiary_by_accountID } = require("../models/Beneficiary");

const get_beneficiary = async (req, res) => {
    try{
        const { accountID } = req.body
        console.log(accountID);
        const beneficiary = await get_beneficiary_by_accountID(accountID)
        res.status(200).json({ status: 200, message: "get beneficiary success", beneficiary: beneficiary });
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: "get beneficiary success", beneficiary: beneficiary });
    }
}

module.exports = {
    get_beneficiary
}