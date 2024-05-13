const { get_statement_by_accountID, get_source_detail, get_all_source_details } = require("../models/join/StatementModel");
const { removeProperties } = require("./Utils");

const tableDetail = [
    { type: "TOPUP", table: "Topup", primary_key: "TopupID" },
    { type: "BILL", table: "Bill", primary_key: "BillID" },
    { type: "TRANSFER", table: "Account", primary_key: "AccountID" },
    { type: "WITHDRAW", table: "ATM", primary_key: "ATMID" }
]

const get_statement_by_account = async (req, res) => {
    try {
        const { accountID } = req.body

        const statement = await get_statement_by_accountID(accountID);

        const enrichedStatement = statement.map(transaction => {
            // Find the corresponding table detail based on the transaction type
            const detail = tableDetail.find(detail => detail.type === transaction.TransactionType);
            // Return a new object that includes all properties of the original transaction
            // and adds the SourceTable object
            return {
                ...transaction,
                SourceTable: {
                    Name: detail ? detail.table : null,
                    PrimaryKey: detail ? detail.primary_key : null
                }
            };
        })


        const statementWithSource = await get_all_source_details(enrichedStatement, tableDetail);

        // Process the result to remove the 'Source' and 'SourceTable' properties
        const formated_statement = statementWithSource.map(transaction => removeProperties(transaction, 'Source', 'SourceTable'));

        res.status(200).json({ status: 200, message: "get all statement transaction success", statement: formated_statement });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    get_statement_by_account
}