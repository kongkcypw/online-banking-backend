const { promisePool } = require("../../config/mysql");

const get_statement_by_accountID = async (destinationID) => {
    try {
        const query = `SELECT t1.TransactionFlow, t1.TransactionType, r.Amount, t1.TransactionFee, t2.DestinationID AS Source, CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') AS DateTime FROM Reference r `
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
            if (table === "Account") {
                const query = `SELECT a.AccountID, a.AccountNumber, u.FirstName, u.LastName FROM ${table} a  `
                    + `JOIN User u ON a.UserID = u.UserID`
                    + ` WHERE ${tableDetail.find(d => d.table === table).primary_key} IN (?) `;
                const [rows] = await promisePool.query(query, [sourceIds]);
                console.log(rows);
                details[table] = rows;
            }
            else {
                const query = `SELECT * FROM ${table} WHERE ${tableDetail.find(d => d.table === table).primary_key} IN (?)`;
                const [rows] = await promisePool.query(query, [sourceIds]);
                console.log(rows);
                details[table] = rows;
            }
            // const query = `SELECT * FROM ${table} WHERE ${tableDetail.find(d => d.table === table).primary_key} IN (?)`;
            // const [rows] = await promisePool.query(query, [sourceIds]);
            // console.log(rows);
            // details[table] = rows;
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

const get_summary_statement_by_accountID = async (destinationID) => {
    try {
        const query = `SELECT 
        MONTH(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS TransactionMonth,
        YEAR(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS TransactionYear,
        t1.TransactionFlow,
        SUM(r.Amount) AS TotalAmount
        FROM 
            Reference r
        JOIN 
            Transaction t1 ON r.ReferenceID = t1.ReferenceID AND t1.DestinationID = ?
        JOIN 
            Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
        WHERE 
            CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY 
            TransactionYear, TransactionMonth, t1.TransactionFlow
        ORDER BY 
            TransactionYear DESC, TransactionMonth DESC, t1.TransactionFlow;`;
        // + `JOIN TopUp tu ON tu.TopUpID = t2.DestinationID`
        const [rows, fields] = await promisePool.query(query, [destinationID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const get_summary_year_statement_by_accountID = async (destinationID) => {
    try {
        const query = `SELECT 
        YEAR(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS TransactionYear,
        MONTH(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS TransactionMonth,
        t1.TransactionFlow,
        COUNT(*) AS TransactionCount,
        SUM(r.Amount) AS TotalAmount
    FROM 
        Reference r
    JOIN 
        Transaction t1 ON r.ReferenceID = t1.ReferenceID AND t1.DestinationID = ?
    JOIN 
        Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
    WHERE 
        YEAR(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) = YEAR(CURDATE())
        AND MONTH(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) <= MONTH(CURDATE())
    GROUP BY 
        TransactionYear, TransactionMonth, t1.TransactionFlow
    ORDER BY 
        TransactionYear DESC, TransactionMonth DESC, t1.TransactionFlow;
    `;
        // + `JOIN TopUp tu ON tu.TopUpID = t2.DestinationID`
        const [rows, fields] = await promisePool.query(query, [destinationID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_statement_by_accountID,
    get_all_source_details,
    get_summary_statement_by_accountID,
    get_summary_year_statement_by_accountID
}