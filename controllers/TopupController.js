const { get_all_topup } = require("../models/TopupModel");

const get_all = async (req, res) => {
    try{
        const topup_data = await get_all_topup();
        console.log(topup_data)
        res.status(200).json({ message: "get topup data success", topup: topup_data });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get_all
}