const { db } = require("../../config/mysql");

const destination_detail_topup_or_bill = async (destinationID, destinationTable, destinationPrimaryKey) => {
    try {
        const query = `SELECT 
            Name,
            Type,
            Image
        FROM 
            ${destinationTable}
        WHERE 
            ${destinationPrimaryKey} = ?;`;

        const [rows, fields] = await db.query(query, [destinationID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const destination_detail_transfer_out = async (destinationID) => {
    try {
        console.log(destinationID);
        const query = `SELECT 
            u.FirstName,
            u.LastName,
            a.AccountNumber,
            bk.Name AS BankName,
            bk.Logo AS BankLogo,
            br.BranchID,
            br.Name AS BranchName
        FROM 
            Account a
        JOIN
            User u ON a.UserID = u.UserID
        JOIN
            Bank bk ON a.BankID = bk.BankID
        JOIN
            Branch br ON a.BranchID = br.BranchID
        WHERE
            a.AccountID = ?`;

        const [rows, fields] = await db.query(query, [destinationID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const destination_detail_transfer_in = async (referenceID) => {
    try {
        const query = `SELECT 
            u.FirstName,
            u.LastName,
            a.AccountNumber,
            bk.Name AS BankName,
            bk.Logo AS BankLogo,
            br.BranchID,
            br.Name AS BranchName
        FROM 
            Transaction t
        JOIN
            Account a ON t.DestinationID = a.AccountID
        JOIN
            User u ON a.UserID = u.UserID
        JOIN
            Bank bk ON a.BankID = bk.BankID
        JOIN
            Branch br ON a.BranchID = br.BranchID
        WHERE
            t.ReferenceID = ? AND t.TransactionFlow = "OUT"`;

        const [rows, fields] = await db.query(query, [referenceID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const destination_detail_withdraw = async (referenceID, transactionID) => {
    try {
        const query = `SELECT 
        t.DestinationID AS ATMID,
        br.Name AS BankName,
        br.BranchID,
        br.Address,
        br.PhoneNumber
        FROM 
            Transaction t
        JOIN
            ATM atm ON t.DestinationID = atm.ATMID
        JOIN
            Branch br ON atm.BranchID = br.BranchID
        WHERE
            t.ReferenceID = ? AND t.TransactionID != ?`;

        const [rows, fields] = await db.query(query, [referenceID, transactionID]);
        return rows;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    destination_detail_topup_or_bill,
    destination_detail_transfer_out,
    destination_detail_transfer_in,
    destination_detail_withdraw
}