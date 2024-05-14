const { db } = require("../../config/mysql");

const get_atm_join = async () => {
    try {
        const query = `SELECT atm.ATMID, br.BranchID ,br.Name, br.Latitude, br.Longitude FROM ATM atm `
        + `JOIN Branch br ON atm.BranchID = br.BranchID`
        const [rows, fields] = await db.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    get_atm_join,
}