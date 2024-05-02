const { get_all_bill } = require("../models/ฺBillModel");

const get_all = async (req, res) => {
    try{
        const bill_data = await get_all_bill();
        console.log(bill_data)
        res.status(200).json({ message: "get bill data success", bills: bill_data });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get_all
}