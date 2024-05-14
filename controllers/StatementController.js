const { get_statement_by_accountID, get_source_detail, get_all_source_details, get_summary_statement_by_accountID, get_summary_year_statement_by_accountID } = require("../models/join/StatementModel");
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

const get_summary_statement = async (req, res) => {
    try {
        const { accountID } = req.body
        const summary = await get_summary_statement_by_accountID(accountID);
        const year_summary = await get_summary_year_statement_by_accountID(accountID)
        console.log(year_summary);
        res.status(200).json({ status: 200, message: "get all statement transaction success", months: summary, year: year_summary });
    } catch (error) {
        res.status(400).json({ status: 400, message: "get all statement transaction success" });
    }
}

module.exports = {
    get_statement_by_account,
    get_summary_statement
}