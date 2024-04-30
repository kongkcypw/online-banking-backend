const { promisePool } = require("../../config/mysql");

const get_statement_by_accountID = async (destinationID) => {
    try {
        const query = `SELECT t1.TransactionFlow, t1.TransactionType, r.Amount, t1.TransactionFee, t2.DestinationID AS Source, r.DateTime FROM Reference r `
        + `JOIN Transaction t1 ON r.ReferenceID = t1.ReferenceID AND t1.DestinationID = ? `
        + `JOIN Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID `;
        // + `JOIN TopUp tu ON tu.TopUpID = t2.DestinationID`
        const [rows, fields] = await promisePool.query(query, [destinationID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const get_all_source_details = async (transactions, tableDetail) => {
    try {
        // Organize transactions by table
        const tableGroups = {};
        transactions.forEach(transaction => {
            const { Name, PrimaryKey } = transaction.SourceTable;
            if (!tableGroups[Name]) {
                tableGroups[Name] = [];
            }
            tableGroups[Name].push(transaction.Source);
        });

        // Fetch details for each table
        const details = {};
        for (const [table, sourceIds] of Object.entries(tableGroups)) {
            console.log("TEST");
            const query = `SELECT * FROM ${table} WHERE ${tableDetail.find(d => d.table === table).primary_key} IN (?)`;
            const [rows] = await promisePool.query(query, [sourceIds]);
            details[table] = rows;
        }

        // Map the details back to the transactions
        const detailedTransactions = transactions.map(transaction => {
            const relevantDetails = details[transaction.SourceTable.Name];
            const detail = relevantDetails.find(d => d[transaction.SourceTable.PrimaryKey] === transaction.Source);
            return {
                ...transaction,
                Detail: detail || null
            };
        });

        return detailedTransactions;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_statement_by_accountID,
    get_all_source_details
}