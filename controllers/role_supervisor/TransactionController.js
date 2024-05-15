const { tableDetail } = require("../../config/tabledetail");
const { destination_detail_topup_or_bill,
    destination_detail_transfer_out, 
    destination_detail_transfer_in, 
    destination_detail_withdraw } = require("../../models/join/DestinationModel");
const {
    one_branch_InOut_transaction_current_date,
    one_branch_count_all_transaction_current_date,
    one_branch_transaction_detail_current_date } = require("../../models/join/TransactionModel");

const get_current_date = async (req, res) => {
    try {
        const { branchID } = req.body;
        const inOut = await one_branch_InOut_transaction_current_date(branchID);
        const count = await one_branch_count_all_transaction_current_date(branchID);
        const detail = await one_branch_transaction_detail_current_date(branchID);
        console.log(inOut);
        console.log(count);
        console.log(detail);
        if (inOut.length > 0 && count.length) {
            res.status(200).json({ status: 200, message: "get transaction in branch success", flow: inOut, sum: count[0], detail: detail });
        }
        else {
            res.status(201).json({ status: 201, message: "no transaction" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
    }
}

const get_destination_detail = async (req, res) => {
    try {
        const { destinationID, destinationType, transactionFlow, referenceID, transactionID } = req.body;

        const destinationTable = tableDetail.find(detail => detail.type === destinationType);

        if (destinationType === "TOPUP" || destinationType === "BILL") {
            const dest_detail = await destination_detail_topup_or_bill(destinationID, destinationTable.table, destinationTable.primary_key);
            res.status(200).json({ status: 200, message: "get destination detail success (topup or bill)", type: destinationType, detail: dest_detail[0] });
        }
        else if (destinationType === "TRANSFER" && transactionFlow === "OUT") {
            const dest_detail = await destination_detail_transfer_out(destinationID);
            res.status(200).json({ status: 200, message: "get destination detail success (transfer out)", type: destinationType, detail: dest_detail[0] });
        }
        else if (destinationType === "TRANSFER" && transactionFlow === "IN") {
            const dest_detail = await destination_detail_transfer_in(referenceID);
            res.status(200).json({ status: 200, message: "get destination detail success (transfer in)", type: destinationType, detail: dest_detail[0] });
        }
        else if (destinationType === "WITHDRAW") {
            const dest_detail = await destination_detail_withdraw(referenceID, transactionID);
            res.status(200).json({ status: 200, message: "get destination detail success (withdraw)", type: destinationType, detail: dest_detail[0] });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ status: 400, message: error });
    }
}

module.exports = {
    get_current_date,
    get_destination_detail,
}