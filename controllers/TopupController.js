const { get_all_topup, get_topup_by_topupID } = require("../models/TopupModel");
const { get_topup_join } = require("../models/complex/PaymentRequire");

const get_all = async (req, res) => {
    try{
        const topup_data = await get_all_topup();
        console.log(topup_data)
        res.status(200).json({ message: "get topup data success", topup: topup_data });
    } catch (error) {
        console.log(error);
    }
}

const get_payment_require = async (req, res) => {
    try{
        const { destID } = req.body
        console.log(destID);
        const require_data = await get_topup_join(destID);
        const topupData = await get_topup_by_topupID(destID)
        res.status(200).json({ message: "get topup require success", info: topupData[0], require: require_data });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get_all,
    get_payment_require
}