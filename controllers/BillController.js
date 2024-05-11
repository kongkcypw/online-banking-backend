const { get_bill_join } = require("../models/complex/PaymentRequire");
const { get_all_bill, get_bill_by_billID } = require("../models/ฺBillModel");

const get_all = async (req, res) => {
    try{
        const bill_data = await get_all_bill();
        console.log(bill_data)
        res.status(200).json({ message: "get bill data success", bills: bill_data });
    } catch (error) {
        console.log(error);
    }
}

const get_payment_require = async (req, res) => {
    try{
        const { destID } = req.body
        console.log(destID);
        const require_data = await get_bill_join(destID);
        const billData = await get_bill_by_billID(destID)
        res.status(200).json({ message: "get bill require success", info: billData[0], require: require_data });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get_all,
    get_payment_require
}