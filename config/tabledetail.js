const tableDetail = [
    { type: "TOPUP", table: "Topup", primary_key: "TopupID" },
    { type: "BILL", table: "Bill", primary_key: "BillID" },
    { type: "TRANSFER", table: "Account", primary_key: "AccountID" },
    { type: "WITHDRAW", table: "ATM", primary_key: "ATMID" }
]

module.exports = {
    tableDetail
}