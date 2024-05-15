const { db } = require("../../config/mysql");

const all_branches_InOut_transaction_current_date = async () => {
    try {
        const query = `SELECT 
        DAY(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Day,
        MONTH(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Month,
        YEAR(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Year,
        t1.TransactionFlow,
        SUM(r.Amount) AS Amount,
        COUNT(*) AS Count
    FROM 
        Reference r
    JOIN 
        Transaction t1 ON r.ReferenceID = t1.ReferenceID
    JOIN 
        Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
    WHERE 
        CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= CURDATE() 
        AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < CURDATE() + INTERVAL 1 DAY
    GROUP BY 
        Year, Month, Day, t1.TransactionFlow
    ORDER BY 
        Year DESC, Month DESC, Day DESC, t1.TransactionFlow;`;
        const [rows, fields] = await db.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

const all_branches_count_all_current_date = async () => {
    try {
        const query = `SELECT 
            DAY(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Day,
            MONTH(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Month,
            YEAR(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Year,
            COUNT(*) AS TotalCount,
            SUM(r.Amount) AS TotalAmount
        FROM 
            Reference r
        JOIN 
            Transaction t1 ON r.ReferenceID = t1.ReferenceID
        JOIN 
            Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
        WHERE 
            CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= CURDATE() 
            AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < CURDATE() + INTERVAL 1 DAY;`;

        const [rows, fields] = await db.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

const one_branch_InOut_transaction_current_date = async (branchID) => {
    try {
        const query = `SELECT 
        DAY(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Day,
        MONTH(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Month,
        YEAR(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Year,
        t1.TransactionFlow,
        SUM(r.Amount) AS Amount,
        COUNT(*) AS Count
    FROM 
        Reference r
    JOIN 
        Transaction t1 ON r.ReferenceID = t1.ReferenceID
    JOIN 
        Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
    JOIN
        Account a ON t1.DestinationID =  a.AccountID
    WHERE 
        CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= CURDATE() 
        AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < CURDATE() + INTERVAL 1 DAY
        AND a.BranchID = ?
    GROUP BY 
        Year, Month, Day, t1.TransactionFlow
    ORDER BY 
        Year DESC, Month DESC, Day DESC, t1.TransactionFlow;`;
        const [rows, fields] = await db.query(query, [branchID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const one_branch_count_all_transaction_current_date = async (branchID) => {
    try {
        const query = `SELECT 
            DAY(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Day,
            MONTH(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Month,
            YEAR(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Year,
            COUNT(*) AS TotalCount,
            SUM(r.Amount) AS TotalAmount
        FROM 
            Reference r
        JOIN 
            Transaction t1 ON r.ReferenceID = t1.ReferenceID
        JOIN 
            Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
        JOIN
            Account a ON t1.DestinationID =  a.AccountID
        WHERE 
            CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= CURDATE() 
            AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < CURDATE() + INTERVAL 1 DAY
            AND a.BranchID = ?;`;

        const [rows, fields] = await db.query(query, [branchID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const one_branch_transaction_detail_current_date = async (branchID) => {
    try {
        const query = `SELECT 
            DAY(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Day,
            MONTH(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Month,
            YEAR(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Year,
            TIME(CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok')) AS Time,
            t1.TransactionType,
            t1.TransactionFlow AS Flow,
            t1.TransactionID,
            r.ReferenceID,
            t2.DestinationID,
            r.Amount,
            u1.FirstName,
            u1.LastName,
            a.AccountNumber,
            bk.Name AS BankName,
            bk.Logo AS BankLogo,
            br.BranchID,
            br.Name AS BranchName
        FROM 
            Reference r
        JOIN 
            Transaction t1 ON r.ReferenceID = t1.ReferenceID
        JOIN 
            Transaction t2 ON r.ReferenceID = t2.ReferenceID
        JOIN
            Account a ON t1.DestinationID =  a.AccountID
        JOIN
            User u1 ON a.UserID = u1.UserID
        JOIN
            Bank bk ON bk.BankID = a.BankID
        JOIN
            Branch br ON br.BranchID = a.BranchID
        WHERE 
            CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= CURDATE() 
            AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < CURDATE() + INTERVAL 1 DAY
            AND a.BranchID = ?
        GROUP BY 
            Year, Month, Day, Time, t1.TransactionFlow
        ORDER BY 
            Year DESC, Month DESC, Day DESC, Time DESC, t1.TransactionFlow;`;

        const [rows, fields] = await db.query(query, [branchID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    all_branches_InOut_transaction_current_date,
    all_branches_count_all_current_date,
    one_branch_InOut_transaction_current_date,
    one_branch_count_all_transaction_current_date,
    one_branch_transaction_detail_current_date
}