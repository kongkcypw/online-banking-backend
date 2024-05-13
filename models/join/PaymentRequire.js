const { promisePool } = require("../../config/mysql");

const get_topup_join = async (topupID) => {
    try {
        const query = `SELECT tur.Require, tur.Label FROM Topup tu `
        + `JOIN TopupRequire tur ON tu.TopupID = tur.TopupID AND tur.TopupID = ?`
        const [rows, fields] = await promisePool.query(query, [topupID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

const get_bill_join = async (billID) => {
    try {
        const query = `SELECT blr.Require, blr.Label FROM Bill bl `
        + `JOIN BillRequire blr ON bl.BillID = blr.BillID AND blr.BillID = ?`
        const [rows, fields] = await promisePool.query(query, [billID]);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_topup_join,
    get_bill_join
}