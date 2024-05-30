const { db } = require("../../config/mysql");

const all_branches_InOut_transaction_date_range = async (startDate, endDate) => {
    try {
        const query = `SELECT 
        'IN' AS TransactionFlow,
        SUM(CASE WHEN t1.TransactionFlow = 'IN' THEN r.Amount ELSE 0 END) AS TotalAmount,
        COUNT(CASE WHEN t1.TransactionFlow = 'IN' THEN 1 END) AS TotalCount
    FROM 
        Reference r
    JOIN 
        Transaction t1 ON r.ReferenceID = t1.ReferenceID
    JOIN 
        Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
    JOIN
        Account a ON t1.DestinationID =  a.AccountID
    WHERE 
        CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
        AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY
    
    UNION
    
    SELECT 
        'OUT' AS TransactionFlow,
        SUM(CASE WHEN t1.TransactionFlow = 'OUT' THEN r.Amount ELSE 0 END) AS TotalAmount,
        COUNT(CASE WHEN t1.TransactionFlow = 'OUT' THEN 1 END) AS TotalCount
    FROM 
        Reference r
    JOIN 
        Transaction t1 ON r.ReferenceID = t1.ReferenceID
    JOIN 
        Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
    JOIN
        Account a ON t1.DestinationID =  a.AccountID
    WHERE 
        CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
        AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY;
    `;
        const [rows, fields] = await db.query(query, [startDate, endDate, startDate, endDate]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const all_branches_count_all_date_range = async (startDate, endDate) => {
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
        CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
        AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY;`;

        const [rows, fields] = await db.query(query, [startDate, endDate]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const all_branches_transaction_detail_date_range = async (startDate, endDate) => {
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
            Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
        JOIN
            Account a ON t1.DestinationID =  a.AccountID
        JOIN
            User u1 ON a.UserID = u1.UserID
        JOIN
            Bank bk ON bk.BankID = a.BankID
        JOIN
            Branch br ON br.BranchID = a.BranchID
        WHERE 
            CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
            AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY
        ORDER BY 
            Year DESC, Month DESC, Day DESC, Time DESC, t1.TransactionFlow;`;

        const [rows, fields] = await db.query(query, [startDate, endDate]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const one_branch_InOut_transaction_date_range = async (branchID, startDate, endDate) => {
    try {
        const query = `SELECT 
        'IN' AS TransactionFlow,
        SUM(CASE WHEN t1.TransactionFlow = 'IN' THEN r.Amount ELSE 0 END) AS TotalAmount,
        COUNT(CASE WHEN t1.TransactionFlow = 'IN' THEN 1 END) AS TotalCount
    FROM 
        Reference r
    JOIN 
        Transaction t1 ON r.ReferenceID = t1.ReferenceID
    JOIN 
        Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
    JOIN
        Account a ON t1.DestinationID =  a.AccountID
    WHERE 
        CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
        AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY
        AND a.BranchID = ?
    
    UNION
    
    SELECT 
        'OUT' AS TransactionFlow,
        SUM(CASE WHEN t1.TransactionFlow = 'OUT' THEN r.Amount ELSE 0 END) AS TotalAmount,
        COUNT(CASE WHEN t1.TransactionFlow = 'OUT' THEN 1 END) AS TotalCount
    FROM 
        Reference r
    JOIN 
        Transaction t1 ON r.ReferenceID = t1.ReferenceID
    JOIN 
        Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
    JOIN
        Account a ON t1.DestinationID =  a.AccountID
    WHERE 
        CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
        AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY
        AND a.BranchID = ?;
    `;
        const [rows, fields] = await db.query(query, [startDate, endDate, branchID, startDate, endDate, branchID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const one_branch_count_all_transaction_date_range = async (branchID, startDate, endDate) => {
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
            CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
            AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY
            AND a.BranchID = ?;`;

        const [rows, fields] = await db.query(query, [startDate, endDate, branchID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const one_branch_transaction_detail_date_range = async (branchID, startDate, endDate) => {
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
            Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
        JOIN
            Account a ON t1.DestinationID =  a.AccountID
        JOIN
            User u1 ON a.UserID = u1.UserID
        JOIN
            Bank bk ON bk.BankID = a.BankID
        JOIN
            Branch br ON br.BranchID = a.BranchID
        WHERE 
            CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
            AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY
            AND a.BranchID = ?
        ORDER BY 
            Year DESC, Month DESC, Day DESC, Time DESC, t1.TransactionFlow;`;

        const [rows, fields] = await db.query(query, [startDate, endDate, branchID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const transaction_ranking_date_range = async (startDate, endDate) => {
    try {
        const query = `SELECT 
        a.BranchID,
        br.Name AS BranchName,
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
    JOIN
        Branch br ON a.BranchID = br.BranchID
    WHERE 
        CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
        AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY
    GROUP BY
        a.BranchID
    ORDER BY
        TotalAmount DESC;`;

        const [rows, fields] = await db.query(query, [startDate, endDate]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const account_ranking_date_range = async (startDate, endDate) => {
    try {
        const query = `SELECT 
            a.AccountID,
            a.AccountNumber,
            u.FirstName,
            u.LastName,
            a.BranchID,
            br.Name AS BranchName,
            SUM(r.Amount) AS TotalAmount,
            ROUND(AVG(r.Amount), 2) AS AverageAmount
        FROM 
            Reference r
        JOIN 
            Transaction t1 ON r.ReferenceID = t1.ReferenceID
        JOIN 
            Transaction t2 ON r.ReferenceID = t2.ReferenceID AND t1.TransactionID != t2.TransactionID
        JOIN
            Account a ON t1.DestinationID = a.AccountID
        JOIN
            User u ON a.UserID = u.UserID
        JOIN
            Branch br ON a.BranchID = br.BranchID
        WHERE 
            CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
            AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY
        GROUP BY
            a.AccountID
        ORDER BY
            TotalAmount DESC;`;

        const [rows, fields] = await db.query(query, [startDate, endDate]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const atm_ranking_date_range = async (startDate, endDate) => {
    try {
        const query = `SELECT 
            t2.DestinationID AS ATMID,
            br.Name AS BranchName,
            br.BranchID,
            SUM(r.Amount) AS TotalAmount,
            ROUND(AVG(r.Amount), 2) AS AverageAmount
        FROM 
            Reference r
        JOIN 
            Transaction t2 ON r.ReferenceID = t2.ReferenceID
        JOIN
            ATM atm on atm.ATMID = t2.DestinationID
        JOIN
            Branch br ON atm.BranchID = br.BranchID
        WHERE 
            CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') >= ? 
            AND CONVERT_TZ(r.DateTime, 'UTC', 'Asia/Bangkok') < ? + INTERVAL 1 DAY
            AND t2.TransactionType = 'WITHDRAW'
            AND t2.DestinationID LIKE 'ATM%'
        GROUP BY
            t2.DestinationID
        ORDER BY
            TotalAmount DESC
        ;`;

        const [rows, fields] = await db.query(query, [startDate, endDate]);
        return rows;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    all_branches_InOut_transaction_date_range,
    all_branches_count_all_date_range,
    all_branches_transaction_detail_date_range,
    one_branch_InOut_transaction_date_range,
    one_branch_count_all_transaction_date_range,
    one_branch_transaction_detail_date_range,
    transaction_ranking_date_range,
    account_ranking_date_range,
    atm_ranking_date_range
}